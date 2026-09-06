import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const data = { exports: {} };
vm.runInNewContext(compile("../lib/constants.ts"), data);
const { SKILLS } = data.exports;
const load = (path) => {
  const module = { exports: {}, require: (name) => name === "@/lib/constants" ? data.exports : require(name) };
  vm.runInNewContext(compile(path), module);
  return module.exports;
};
const { SkillCabinet } = load("../components/summit/SkillCabinet.tsx");
const { TerrainGem } = load("../components/summit/TerrainGem.tsx");
const escape = (text) => renderToStaticMarkup(createElement("span", null, text)).replace(/^<span>|<\/span>$/g, "");
const html = renderToStaticMarkup(createElement(SkillCabinet));
const articles = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)];
assert.equal(articles.length, 6, "All six skill fields must be available in the server document");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Skill headings and fragment targets must stay unique");
let toolCount = 0;
for (const [index, [, attributes, content]] of articles.entries()) {
  assert(attributes.includes(`id="skill-field-${index}"`), "Existing skill fragment links must keep working");
  assert(attributes.includes('tabindex="-1"'), "Native fragment navigation can focus each article");
  assert(attributes.includes(`aria-labelledby="skill-title-${index}"`));
  assert(content.includes(`<h3 id="skill-title-${index}">${escape(SKILLS[index].category)}</h3>`));
  assert(content.includes(escape(SKILLS[index].description)), "Every original skill description remains readable");
  const tools = [...content.matchAll(/<li>(.*?)<\/li>/g)].map((match) => match[1]);
  assert.deepEqual(tools, [...SKILLS[index].tools].map(escape), "Each tool must appear once in its original field");
  toolCount += tools.length;
  assert.equal((content.match(/<ul\b/g) ?? []).length, 1, "A field has one semantic tool list");
  assert.equal((content.match(/aria-hidden=/g) ?? []).length, 1, "Only the decorative index is hidden from assistive technology");
}
assert(!/<(?:canvas|button|dialog|script)\b|\binert\b|data-expedition-|data-theatre-|on(?:scroll|wheel|touch)/i.test(html), "Reading skills must not require a canvas, interaction, or pacing state");
assert(!html.includes("mineral-composition"), "The document cannot duplicate skills for visual-only scenes");

for (const variant of ["cluster", "shard", "pair"]) {
  const markup = renderToStaticMarkup(createElement(TerrainGem, { variant, className: "placement-example" }));
  assert(markup.includes(`terrain-gem--${variant} placement-example`), "The parent owns each decorative placement");
  assert(/^<span[^>]+aria-hidden="true"/.test(markup));
  assert(/<svg[^>]+focusable="false"[^>]+aria-hidden="true"/.test(markup));
  assert(!/\bid=|\btabindex=|<canvas|<button|<a\b|<animate|<filter|<foreignObject|<script/i.test(markup), "Decorative gems cannot claim focus, allocate WebGL, or run animations");
  const paths = [...markup.matchAll(/\bd="([^"]+)"/g)];
  assert(paths.length >= 6, "Every gem retains its faceted silhouette");
  for (const [, path] of paths) {
    const values = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
    assert.equal(values.length % 2, 0);
    values.forEach((value, index) => assert(Number.isFinite(value) && value >= 0 && value <= (index % 2 ? 400 : 300), "Facets stay inside the shared viewBox"));
  }
}
console.log(`Static skills checks passed: six complete server-rendered articles, ${toolCount} tools without duplicates, stable named anchors, semantic lists, and three noninteractive finite SVG gem silhouettes.`);
