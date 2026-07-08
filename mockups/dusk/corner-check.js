// Parallax corner verification — cursor at 4 corners x scroll 0/0.5/1.0.
// Pass criterion: no depth-layer edge visible in any shot. Run after build.js.
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

async function main() {
  fs.mkdirSync(PROFILE, { recursive: true });
  const chrome = spawn(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--user-data-dir=" + PROFILE, "--remote-debugging-port=9223", "about:blank",
  ], { stdio: "ignore" });

  let targets;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      targets = await (await fetch("http://127.0.0.1:9223/json")).json();
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

  async function pass(W, H, tag) {
    await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: PAGE });
    await sleep(3000);
    const corners = [["tl", 2, 2], ["tr", W - 2, 2], ["bl", 2, H - 2], ["br", W - 2, H - 2]];
    for (const f of [0, 0.5, 1.0]) {
      await send("Runtime.evaluate", {
        expression: "window.scrollTo(0, (document.querySelector('.hero-journey').offsetHeight - innerHeight) * " + f + ")",
      });
      await sleep(1600);
      for (const [c, x, y] of corners) {
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
        await sleep(2200); // lerp (0.045/frame) needs ~2s to settle
        await shot("corner-" + tag + "-p" + f * 100 + "-" + c + ".png");
      }
    }
  }

  await send("Page.enable");
  await pass(1440, 900, "wide");
  await pass(1000, 800, "narrow"); // proportional amplitude check on narrow windows

  ws.close();
  chrome.kill();
  try { execFileSync("taskkill", ["/F", "/PID", String(chrome.pid), "/T"], { stdio: "ignore" }); } catch {}
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
