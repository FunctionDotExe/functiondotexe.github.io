// CDP screenshot driver — full story pass, desktop + mobile + reduced-motion.
// Run after build.js. Inspect EVERY shot.
const { spawn, execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SP = __dirname;
const PAGE = "file:///" + SP.replace(/\\/g, "/") + "/dusk-mockup.html";
const PROFILE = path.join(SP, "chrome-profile-" + Date.now());
const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find(fs.existsSync);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [name, scroll-expression] — expression returns the target scrollY
const wrapFrac = (sel, f) =>
  "(function(){var w=document.querySelector('" + sel + "');return w.offsetTop+(w.offsetHeight-innerHeight)*" + f + ";})()";
const centerOf = (sel, i) =>
  "(function(){var e=document.querySelectorAll('" + sel + "')[" + (i || 0) + "];var r=e.getBoundingClientRect();return scrollY+r.top+r.height/2-innerHeight/2;})()";
const CHECKPOINTS = [
  ["01-hero", "0"],
  ["02-sunset-mid", wrapFrac(".hero-journey", 0.55)],
  ["03-nightfall", centerOf(".nightfall p", 0)],
  ["04-threshold-rise", wrapFrac(".threshold-journey", 0.3)],
  ["05-threshold-soil", wrapFrac(".threshold-journey", 0.62)],
  ["06-threshold-copy", wrapFrac(".threshold-journey", 0.78)],
  ["07-roots-decypher", centerOf(".waypoint", 0)],
  ["08-roots-forge", centerOf(".waypoint", 1)],
  ["09-cavern-specimens", centerOf(".cv-projects", 0)],
  ["10-cavern-cluster", centerOf(".cluster", 0)],
  ["11-strata-top", centerOf(".band", 1)],
  ["12-strata-bedrock", centerOf(".band.bedrock", 0)],
  ["13-volcano", wrapFrac(".volcano-journey", 0.55)],
  ["14-chamber", "document.body.scrollHeight"],
];

async function main() {
  fs.mkdirSync(PROFILE, { recursive: true });
  const chrome = spawn(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--user-data-dir=" + PROFILE, "--remote-debugging-port=9222", "about:blank",
  ], { stdio: "ignore" });

  let targets;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      targets = await (await fetch("http://127.0.0.1:9222/json")).json();
      if (targets.length) break;
    } catch {}
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) =>
    new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

  async function shot(name) {
    const r = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(SP, name), Buffer.from(r.result.data, "base64"));
    console.log("saved", name);
  }
  async function pass(width, height, mobile, prefix, checkpoints) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
    await send("Page.navigate", { url: PAGE });
    await sleep(3500);
    for (const [name, expr] of checkpoints) {
      await send("Runtime.evaluate", { expression: "window.scrollTo(0, " + expr + ")" });
      await sleep(2400); // lerp settle
      await shot(prefix + "-" + name + ".png");
    }
  }

  await send("Page.enable");
  await pass(1440, 900, false, "desk", CHECKPOINTS);
  await pass(390, 844, true, "mob", CHECKPOINTS);

  // reduced-motion: pinned scenes collapse to static art
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await pass(1440, 900, false, "rm", [
    ["01-hero", "0"],
    ["02-threshold", centerOf(".th-ground", 0)],
    ["03-roots", centerOf(".waypoint", 0)],
    ["04-strata", centerOf(".band", 2)],
    ["05-volcano", centerOf(".vo-copy", 0)],
    ["06-chamber", "document.body.scrollHeight"],
  ]);

  ws.close();
  chrome.kill();
  try { execFileSync("taskkill", ["/F", "/PID", String(chrome.pid), "/T"], { stdio: "ignore" }); } catch {}
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
