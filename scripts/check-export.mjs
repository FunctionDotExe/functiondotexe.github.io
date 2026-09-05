import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportRoot = resolve(root, "out");
const indexPath = resolve(exportRoot, "index.html");
const base = new URL("https://export.invalid/index.html");
const errors = new Set();
const assetPaths = new Set();
const sourceAssets = new Set();
const cssQueue = [];
const fail = (message) => errors.add(message);

if (!existsSync(indexPath)) {
  console.error("FAIL: out/index.html is missing. Build the static export first.");
  process.exit(1);
}

function decodeEntities(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, code) => {
    if (code[0] !== "#") return named[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === "x" ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

// No HTML parser is installed. Tokenize quoted attributes conservatively and
// skip raw script/style content, including Next's serialized hydration markup.
// This validates references; it does not claim to validate the HTML tree.
function elements(html) {
  const result = [];
  const tags = /<!--[\s\S]*?-->|<([a-z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
  for (let match; (match = tags.exec(html));) {
    if (!match[1]) continue;
    const tag = match[1].toLowerCase();
    const attrs = new Map();
    const attributes = /([^\s=\/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    for (const attribute of match[2].matchAll(attributes)) {
      attrs.set(attribute[1].toLowerCase(), decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? ""));
    }
    const element = { tag, attrs, text: "" };
    result.push(element);
    if (["script", "style", "title", "textarea"].includes(tag)) {
      const close = new RegExp(`</${tag}\\s*>`, "gi");
      close.lastIndex = tags.lastIndex;
      const end = close.exec(html);
      if (end) {
        element.text = decodeEntities(html.slice(tags.lastIndex, end.index));
        tags.lastIndex = close.lastIndex;
      }
    }
  }
  return result;
}

function localUrl(value, from = base) {
  if (!value || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(value)) return null;
  try { return new URL(value, from); }
  catch { fail(`Invalid local URL: ${value}`); return null; }
}

function inside(directory, path) {
  const pathWithin = relative(directory, path);
  return !isAbsolute(pathWithin) && pathWithin !== ".." && !pathWithin.startsWith(`..${sep}`);
}

function exportedFile(url, label) {
  let path;
  try { path = resolve(exportRoot, `.${decodeURIComponent(url.pathname)}`); }
  catch { fail(`${label}: invalid encoded path ${url.pathname}`); return null; }
  if (!inside(exportRoot, path)) { fail(`${label}: path escapes the export directory`); return null; }
  const candidates = [path, resolve(path, "index.html"), `${path}.html`];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

function checkAsset(value, label, from = base) {
  const url = localUrl(value, from);
  if (!url) return;
  const path = exportedFile(url, label);
  if (!path) { fail(`${label}: missing exported asset ${url.pathname}`); return; }
  if (assetPaths.has(path)) return;
  assetPaths.add(path);
  if (extname(path) === ".css") cssQueue.push({ path, url });
}

const html = readFileSync(indexPath, "utf8");
const nodes = elements(html);
const ids = new Map();
const fragments = new Set();
const referenceAttributes = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-activedescendant", "aria-details", "aria-errormessage", "aria-flowto", "for"];
let controlCount = 0;

for (const node of nodes) {
  if (!node.attrs.has("id")) continue;
  const id = node.attrs.get("id");
  if (!id) fail(`Empty id on <${node.tag}>`);
  else if (ids.has(id)) fail(`Duplicate id: ${id}`);
  else ids.set(id, node);
}

for (const { tag, attrs } of nodes) {
  for (const name of referenceAttributes) {
    if (!attrs.has(name)) continue;
    const references = attrs.get(name).trim().split(/\s+/).filter(Boolean);
    if (!references.length) fail(`Empty ${name} on <${tag}>`);
    for (const id of references) if (!ids.has(id)) fail(`<${tag}> ${name} references missing id: ${id}`);
  }
  const href = attrs.get("href");
  const url = localUrl(href);
  if (url?.hash && ["/", "/index.html"].includes(url.pathname)) {
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); }
    catch { fail(`Invalid encoded fragment: ${href}`); }
    if (id) {
      fragments.add(id);
      if (!ids.has(id)) fail(`Broken fragment link: ${href}`);
    }
  }
  for (const name of ["src", "href", "poster"]) {
    const value = attrs.get(name);
    if (value && !value.startsWith("#")) checkAsset(value, `<${tag}> ${name}`);
  }
  for (const name of ["srcset", "imagesrcset"]) {
    const value = attrs.get(name);
    if (!value || value.trim().startsWith("data:")) continue;
    for (const candidate of value.split(",")) checkAsset(candidate.trim().split(/\s+/)[0], `<${tag}> ${name}`);
  }
}

// A focused static control check. Runtime-only controls are covered by the
// interaction suites; this does not claim a full accessible-name computation.
const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
for (const match of markup.matchAll(/<(button|a|summary)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1>/gi)) {
  const [, tag, attributes, body] = match;
  const attrs = elements(`<${tag}${attributes}>`)[0].attrs;
  const text = decodeEntities(body.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "").replace(/<[^>]*>/g, "")).trim();
  controlCount++;
  if (!attrs.get("aria-label")?.trim() && !attrs.get("aria-labelledby")?.trim() && !text) fail(`Unnamed <${tag}> control`);
  if (tag === "button" && attrs.get("type") !== "button") fail(`Button lacks explicit type=button: ${attrs.get("aria-label") ?? text}`);
  if (tag === "a" && !attrs.get("href")) fail(`Link has no destination: ${text}`);
  if (tag !== "summary" && /<(?:button|a|input|select|textarea)\b/i.test(body)) fail(`Nested interactive element inside <${tag}>: ${attrs.get("aria-label") ?? text}`);
  if (tag === "button" && /<(?:div|figure|section|article)\b/i.test(body)) fail(`Non-phrasing content inside button: ${attrs.get("aria-label") ?? text}`);
  if (attrs.get("aria-haspopup") === "dialog") {
    const target = attrs.get("aria-controls");
    if (!target || ids.get(target)?.tag !== "dialog") fail(`Dialog trigger lacks a valid dialog target: ${attrs.get("aria-label") ?? text}`);
  }
}

for (const { path, url } of cssQueue) {
  const css = readFileSync(path, "utf8");
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/g)) {
    const value = match[1] ?? match[2] ?? match[3];
    if (!value.startsWith("#")) checkAsset(value, relative(root, path), url);
  }
  for (const match of css.matchAll(/@import\s+["']([^"']+)["']/g)) checkAsset(match[1], relative(root, path), url);
}

const destinations = ["project-phones", "project-console", "project-signal", "project-workshop", "project-skin-cancer", "project-embedded-robotics"];
for (const id of [...destinations, "main-content", "entry", "work", "crust", "experience", "about", "contact"]) {
  if (!ids.has(id)) fail(`Required destination is missing: #${id}`);
}
for (const id of destinations) if (!fragments.has(id)) fail(`Project has no direct navigation link: #${id}`);

const title = nodes.filter(({ tag }) => tag === "title");
if (title.length !== 1 || !/Ruben Maxwell/i.test(title[0].text)) fail("The page must have one meaningful Ruben Maxwell title");
if (!nodes.find(({ tag }) => tag === "html")?.attrs.get("lang")) fail("The page language is missing");
if (nodes.filter(({ tag }) => tag === "main").length !== 1) fail("The page must have exactly one main landmark");
if (nodes.filter(({ tag }) => tag === "h1").length !== 1) fail("The page must have exactly one primary heading");
const meta = (key) => nodes.find(({ tag, attrs }) => tag === "meta" && (attrs.get("name") === key || attrs.get("property") === key))?.attrs.get("content");
for (const key of ["description", "og:title", "og:description", "og:type"]) if (!meta(key)?.trim()) fail(`Missing metadata: ${key}`);
const cnamePath = resolve(root, "CNAME");
if (existsSync(cnamePath)) {
  const expected = `https://${readFileSync(cnamePath, "utf8").trim()}`;
  const canonical = nodes.find(({ tag, attrs }) => tag === "link" && attrs.get("rel") === "canonical")?.attrs.get("href");
  if (canonical?.replace(/\/$/, "") !== expected || meta("og:url")?.replace(/\/$/, "") !== expected) fail("Canonical and Open Graph URLs must match the configured CNAME");
}
if (!/width\s*=\s*device-width/i.test(meta("viewport") ?? "")) fail("Responsive viewport metadata is missing");
if (!nodes.some(({ tag, attrs }) => tag === "meta" && attrs.get("charset")?.toLowerCase() === "utf-8")) fail("UTF-8 charset metadata is missing");
if (!nodes.some(({ tag, attrs }) => tag === "a" && /^mailto:[^@?]+@[^@?]+/i.test(attrs.get("href") ?? ""))) fail("The contact email link is missing");
for (const { tag, attrs } of nodes) {
  if (tag === "meta" && ["og:image", "twitter:image"].includes(attrs.get("property") ?? attrs.get("name"))) checkAsset(attrs.get("content"), "Social preview metadata");
}

function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:[cm]?[jt]sx?|css)$/.test(entry.name) ? [path] : [];
  });
}

const assetExtension = /\.(?:avif|gif|ico|jpe?g|json|mp3|mp4|ogg|otf|pdf|png|svg|ttf|wav|webm|webp|woff2?)$/i;
for (const path of ["app", "components", "lib"].flatMap((directory) => sourceFiles(resolve(root, directory)))) {
  const source = readFileSync(path, "utf8");
  const references = [...source.matchAll(/(["'`])((?:\/(?!\/)|\.\.?\/)[^"'`\r\n]+)\1/g)].map((match) => match[2]);
  for (const match of source.matchAll(/url\(\s*([^\s"')]+)\s*\)/g)) references.push(match[1]);
  for (const value of references) {
    if (value.includes("${")) continue;
    const pathname = value.split(/[?#]/, 1)[0];
    if (!assetExtension.test(pathname)) continue;
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch { fail(`${relative(root, path)}: invalid asset URL ${value}`); continue; }
    const asset = decoded.startsWith("/") ? resolve(root, "public", `.${decoded}`) : resolve(dirname(path), decoded);
    if (!inside(root, asset) || !existsSync(asset) || !statSync(asset).isFile()) fail(`${relative(root, path)}: missing source asset ${value}`);
    else sourceAssets.add(asset);
  }
}

if (errors.size) {
  console.error(`FAIL: ${errors.size} export issue(s):\n${[...errors].map((message) => `- ${message}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: export has ${ids.size} unique IDs, ${fragments.size} fragment destinations, ${controlCount} named controls, valid accessibility references, all six projects, required anchors and domain metadata, ${assetPaths.size} local export files, and ${sourceAssets.size} source assets.`);
}
