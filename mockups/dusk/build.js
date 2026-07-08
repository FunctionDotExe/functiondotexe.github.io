// Builds dusk-mockup.html from the template + base64 assets.
// Usage: node build.js   (then: node cdp-shots.js to screenshot-verify)
const fs = require("fs");
const path = require("path");

const SP = __dirname;
const read = (f) => fs.readFileSync(path.join(SP, f), "utf8");

const b64 = (rel) => fs.readFileSync(path.join(SP, "..", "..", rel)).toString("base64");

const html = read("dusk-mockup.template.html")
  .replace("__FONT_B64__", read("font.b64").trim())
  .replace("__IMG_B64__", read("img.b64").trim())
  .replace("__IMG2_B64__", b64("public/media/forge-fountain.png"));

fs.writeFileSync(path.join(SP, "dusk-mockup.html"), html);
// viewable copy at repo root (untracked)
fs.writeFileSync(path.join(SP, "..", "..", "dusk-mockup.html"), html);
console.log("built dusk-mockup.html (" + Math.round(html.length / 1024) + " KB)");
