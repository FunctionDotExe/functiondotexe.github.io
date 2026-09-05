import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/InteractiveDisclosures.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function harness({ open = false, hoverable = true, reduced = false } = {}) {
  let time = 0;
  let serial = 0;
  let cleanup;
  let activeAnimation;
  const timers = new Map();
  const properties = new Map();
  const starts = [];
  const makeEvents = () => {
    const callbacks = new Map();
    return {
      addEventListener: (name, callback) => callbacks.set(name, callback),
      removeEventListener: (name) => callbacks.delete(name),
      fire: (name, data = {}) => callbacks.get(name)?.({ preventDefault() {}, ...data }),
    };
  };
  const document = { ...makeEvents(), activeElement: null };
  const summary = { ...makeEvents(), focus: () => { document.activeElement = summary; } };
  const contentLink = {};
  const height = () => {
    if (activeAnimation) {
      const t = Math.min(1, (time - activeAnimation.started) / activeAnimation.duration);
      return activeAnimation.from + (activeAnimation.to - activeAnimation.from) * t;
    }
    return details.open ? (properties.get("height") === "auto" || !properties.has("height") ? 240 : Number.parseFloat(properties.get("height"))) : 0;
  };
  const panel = {
    style: {
      get height() { return properties.get("height"); },
      set height(value) { properties.set("height", value); },
      removeProperty: (name) => properties.delete(name),
    },
    scrollHeight: 240,
    getBoundingClientRect: () => ({ height: height() }),
    contains: (target) => target === contentLink,
    animate: (frames, options) => {
      const animation = {
        from: Number.parseFloat(frames[0].height), to: Number.parseFloat(frames[1].height),
        started: time, duration: options.duration, onfinish: null,
        cancel: () => { timers.delete(animation.timer); if (activeAnimation === animation) activeAnimation = undefined; },
      };
      animation.timer = ++serial;
      timers.set(animation.timer, { at: time + options.duration, callback: () => animation.onfinish?.() });
      starts.push(animation.from);
      activeAnimation = animation;
      return animation;
    },
  };
  const details = {
    ...makeEvents(), open, dataset: {},
    querySelector: (selector) => selector === "summary" ? summary : panel,
    contains: (target) => target === summary || target === contentLink,
  };
  document.querySelectorAll = () => [details];
  const hover = { ...makeEvents(), matches: hoverable };
  const motion = { ...makeEvents(), matches: reduced };
  const context = {
    exports: {}, document,
    require: () => ({ useEffect: (effect) => { cleanup = effect(); } }),
    matchMedia: (query) => query.includes("reduced-motion") ? motion : hover,
    getComputedStyle: () => ({ opacity: "1" }),
    setTimeout: (callback, delay) => { timers.set(++serial, { at: time + delay, callback }); return serial; },
    clearTimeout: (id) => timers.delete(id),
  };
  vm.runInNewContext(source, context);
  context.exports.InteractiveDisclosures();
  return {
    details, summary, document, starts,
    enter: (pointerType = "mouse") => details.fire("pointerenter", { pointerType }),
    leave: (pointerType = "mouse") => details.fire("pointerleave", { pointerType }),
    click: () => summary.fire("click"),
    escape: () => document.fire("keydown", { key: "Escape" }),
    focusBody: () => { document.activeElement = contentLink; details.fire("focusin"); },
    blur: () => { document.activeElement = null; details.fire("focusout"); },
    reduce: () => { motion.matches = true; motion.fire("change"); },
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
    unmount: () => { cleanup(); assert.equal(timers.size, 0, "Unmount must clear pending animation and hover timers"); },
  };
}

const preview = harness();
preview.enter();
preview.advance(119);
assert.equal(preview.details.open, false, "Passing over a crystal must not immediately expand it");
preview.advance(1);
assert.equal(preview.details.dataset.expanded, "true");
preview.advance(260);
preview.leave();
preview.advance(219);
assert.equal(preview.details.open, true, "Give the pointer time to enter the preview content");
preview.advance(1);
assert.equal(preview.details.dataset.expanded, "false");
assert.equal(preview.details.open, true, "Keep native content visible until closing animation finishes");
preview.advance(200);
assert.equal(preview.details.open, false);
preview.unmount();

const pinned = harness();
pinned.enter();
pinned.advance(380);
pinned.click();
pinned.leave();
pinned.advance(1000);
assert.equal(pinned.details.open, true, "Click must pin an existing hover preview");
pinned.enter();
pinned.click();
pinned.advance(1000);
assert.equal(pinned.details.open, false, "Explicit close must win over a stationary hovering pointer");
pinned.unmount();

const keyboard = harness();
keyboard.enter();
keyboard.advance(380);
keyboard.focusBody();
keyboard.leave();
keyboard.advance(1000);
assert.equal(keyboard.details.open, true, "Hover departure must not hide focused content");
keyboard.escape();
assert.equal(keyboard.document.activeElement, keyboard.summary, "Escape must return focus before hiding the panel");
keyboard.advance(200);
assert.equal(keyboard.details.open, false);
keyboard.unmount();

const touch = harness({ hoverable: false });
touch.enter("touch");
touch.advance(1000);
assert.equal(touch.details.open, false);
touch.click();
touch.advance(260);
assert.equal(touch.details.open, true, "Tap and keyboard activation must still toggle the disclosure");
touch.unmount();

const reversal = harness();
reversal.click();
reversal.advance(100);
reversal.click();
assert(reversal.starts[1] > 0 && reversal.starts[1] < 240, "Reversing mid-animation must continue from the current height");
reversal.advance(200);
assert.equal(reversal.details.open, false);
reversal.unmount();

const motion = harness();
motion.click();
motion.advance(80);
motion.reduce();
assert.equal(motion.details.open, true, "Reduced motion must settle at the requested state immediately");
motion.click();
assert.equal(motion.details.open, false);
motion.unmount();

const defaultOpen = harness({ open: true });
defaultOpen.enter();
defaultOpen.leave();
defaultOpen.advance(1000);
assert.equal(defaultOpen.details.open, true, "Initially open experience content must remain pinned");
defaultOpen.unmount();

const briefHover = harness();
briefHover.enter();
briefHover.leave();
briefHover.advance(1000);
assert.equal(briefHover.details.open, false);
briefHover.enter();
briefHover.unmount();

console.log("PASS: hover intent, delayed close, pin/unpin, focus persistence, Escape, touch, animation reversal, reduced motion, initial state, and timer cleanup.");
