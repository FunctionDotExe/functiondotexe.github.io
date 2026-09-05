import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function compile(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}
const bootSource = compile("../lib/arrival.ts");
const introSource = compile("../components/summit/ArrivalIntro.tsx");
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

function harness({ hash = "", reduced = false, navigation = "navigate", pendingImage = false } = {}) {
  let time = 0;
  let serial = 0;
  let cleanup;
  let resolveImage;
  const timers = new Map();
  const frames = new Map();
  const events = new Map();
  const ref = { current: null };
  const root = { dataset: {} };
  const image = pendingImage ? new Promise((resolve) => { resolveImage = resolve; }) : Promise.resolve();
  const preference = {
    matches: reduced,
    addEventListener: (name, callback) => events.set("motion:" + name, callback),
    removeEventListener: (name) => events.delete("motion:" + name),
  };
  const context = {
    exports: {}, scrollY: 0, location: { hash },
    performance: { getEntriesByType: () => [{ type: navigation }] },
    matchMedia: () => preference,
    setTimeout: (callback, delay) => { timers.set(++serial, { at: time + delay, callback }); return serial; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: (name) => events.delete(name),
    scrollTo: () => { context.scrollY = 0; },
    require: (name) => {
      if (name === "react") return { useRef: () => ref, useEffect: (effect) => { cleanup = effect(); } };
      if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
      if (name === "lucide-react") return { RotateCcw: () => null };
      throw Error(name);
    },
    document: {
      documentElement: root, hidden: false,
      querySelectorAll: () => [{ decode: () => image }],
      addEventListener: (name, callback) => events.set(name, callback),
      removeEventListener: (name) => events.delete(name),
    },
  };
  context.window = context;
  vm.runInNewContext(bootSource, context);
  vm.runInNewContext(context.exports.ARRIVAL_BOOTSTRAP, context);
  context.exports = {};
  vm.runInNewContext(introSource, context);
  return {
    state: () => root.dataset.arrival,
    mount: () => context.exports.ArrivalIntro(),
    unmount: () => cleanup(),
    event: (name) => events.get(name)?.(),
    resolveImage: () => resolveImage?.(),
    reduce: () => { preference.matches = true; events.get("motion:change")?.(); },
    frame: () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); },
    advance: (elapsed) => {
      const until = time + elapsed;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        time = next[1].at;
        timers.delete(next[0]);
        next[1].callback();
      }
      time = until;
    },
  };
}

for (const options of [{ hash: "#work" }, { reduced: true }, { navigation: "back_forward" }]) {
  const test = harness(options);
  assert.equal(test.state(), undefined, "Deep links, back navigation, and reduced motion must skip the opening");
  test.mount();
  await flush();
  test.frame();
  assert.equal(test.state(), undefined);
  test.unmount();
}

const noHydration = harness();
assert.equal(noHydration.state(), "boot");
noHydration.advance(1400);
assert.equal(noHydration.state(), undefined, "The server-rendered page must fail open without hydration");

const normal = harness();
normal.mount();
assert.equal(normal.state(), "waiting");
await flush();
normal.frame();
assert.equal(normal.state(), "playing");
normal.advance(3100);
assert.equal(normal.state(), undefined);
normal.event("journey:replay-arrival");
await flush();
normal.frame();
assert.equal(normal.state(), "playing", "Replay must start a new sequence");
normal.event("keydown");
assert.equal(normal.state(), undefined, "Keyboard intent must reveal the page immediately");
normal.unmount();

const slow = harness({ pendingImage: true });
slow.mount();
slow.advance(900);
slow.frame();
assert.equal(slow.state(), "playing", "Slow images must not hold the page behind an indefinite loader");
slow.reduce();
assert.equal(slow.state(), undefined, "Changing motion preference must cancel an active intro");
slow.unmount();

const interrupted = harness({ pendingImage: true });
interrupted.mount();
interrupted.event("wheel");
assert.equal(interrupted.state(), undefined);
interrupted.resolveImage();
await flush();
interrupted.frame();
assert.equal(interrupted.state(), undefined, "Late decoding must never restart a dismissed opening");
interrupted.unmount();

const strict = harness();
strict.mount();
strict.unmount();
strict.mount();
await flush();
strict.frame();
assert.equal(strict.state(), "playing", "Development effect remounts must preserve the opening");
strict.unmount();
strict.advance(5000);
assert.equal(strict.state(), undefined);

console.log("PASS: initial arrival, replay, bounded asset wait, input cancellation, late decode, reduced motion, deep links, back navigation, hydration fallback, and effect remounts.");
