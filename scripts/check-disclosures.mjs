import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/InteractiveDisclosures.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function harness({ open = false, reduced = false, hash = "", expeditionStop = "" } = {}) {
  let time = 0;
  let serial = 0;
  let cleanup;
  let activeAnimation;
  const timers = new Map();
  const frames = new Map();
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
  const window = { ...makeEvents(), location: { hash } };
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
    ...makeEvents(), id: "project-research", open, dataset: { expeditionStop },
    querySelector: (selector) => selector === "summary" ? summary : panel,
    contains: (target) => target === summary || target === contentLink,
  };
  document.querySelectorAll = () => [details];
  const motion = { ...makeEvents(), matches: reduced };
  const context = {
    exports: {}, document, window,
    require: () => ({ useEffect: (effect) => { cleanup = effect(); } }),
    matchMedia: () => motion,
    getComputedStyle: () => ({ opacity: "1" }),
    setTimeout: (callback, delay) => { timers.set(++serial, { at: time + delay, callback }); return serial; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  vm.runInNewContext(source, context);
  context.exports.InteractiveDisclosures();
  return {
    details, summary, document, starts,
    enter: (pointerType = "mouse") => details.fire("pointerenter", { pointerType }),
    leave: (pointerType = "mouse") => details.fire("pointerleave", { pointerType }),
    click: () => summary.fire("click"),
    escape: (data = {}) => document.fire("keydown", { key: "Escape", ...data }),
    focusBody: () => { document.activeElement = contentLink; details.fire("focusin"); },
    blur: () => { document.activeElement = null; details.fire("focusout"); },
    reduce: () => { motion.matches = true; motion.fire("change"); },
    hash: (value) => { window.location.hash = value; window.fire("hashchange"); },
    follow: (value, data = {}) => document.fire("click", {
      button: 0,
      target: { closest: () => ({ getAttribute: () => value }) },
      ...data,
    }),
    print: () => window.fire("beforeprint"),
    afterPrint: () => window.fire("afterprint"),
    tour: (id) => window.fire("expedition:stop", { detail: { id, label: "Research" } }),
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
    unmount: () => {
      cleanup();
      assert.equal(timers.size, 0, "Unmount must clear pending animations");
      assert.equal(frames.size, 0, "Unmount must cancel pending focus callbacks");
    },
  };
}

const pointer = harness();
for (const kind of ["mouse", "touch", "pen"]) {
  pointer.enter(kind); pointer.advance(1000); pointer.leave(kind); pointer.advance(1000);
  assert.equal(pointer.details.open, false, "Passing over a disclosure while scrolling must never expand it");
}
pointer.focusBody(); pointer.advance(1000);
assert.equal(pointer.details.open, false, "Focus movement alone must not expand content");
pointer.click(); pointer.advance(260);
pointer.leave(); pointer.blur(); pointer.advance(1000);
assert.equal(pointer.details.open, true, "Explicitly opened content stays open after pointer and focus departure");
pointer.enter(); pointer.click();
assert.equal(pointer.details.open, true, "Content remains visible until its closing animation finishes");
assert.equal(pointer.details.dataset.expanded, "false");
pointer.advance(200);
assert.equal(pointer.details.open, false, "Explicit close must remain closed under a stationary pointer");
pointer.unmount();

const keyboard = harness();
keyboard.click(); keyboard.advance(260); keyboard.focusBody(); keyboard.escape();
assert.equal(keyboard.document.activeElement, keyboard.summary, "Escape must return focus before hiding its panel");
keyboard.advance(200);
assert.equal(keyboard.details.open, false);
keyboard.unmount();

const unrelatedEscape = harness({ open: true });
unrelatedEscape.escape(); unrelatedEscape.advance(300);
assert.equal(unrelatedEscape.details.open, true, "Escape outside a disclosure must not close background content");
unrelatedEscape.unmount();

const reversal = harness();
reversal.click(); reversal.advance(100); reversal.click();
assert(reversal.starts[1] > 0 && reversal.starts[1] < 240, "Animation reversal must continue from the current height");
reversal.advance(200);
assert.equal(reversal.details.open, false);
reversal.unmount();

const motion = harness();
motion.click(); motion.advance(80); motion.reduce();
assert.equal(motion.details.open, true, "Reduced motion must settle at the requested state immediately");
motion.click();
assert.equal(motion.details.open, false);
motion.unmount();

const defaultOpen = harness({ open: true });
defaultOpen.enter(); defaultOpen.leave(); defaultOpen.advance(1000);
assert.equal(defaultOpen.details.open, true, "Initially open experience content must remain open");
defaultOpen.unmount();

const modal = harness({ open: true });
modal.focusBody();
let prevented = false;
modal.escape({ target: { closest: () => ({ open: true }) }, preventDefault: () => { prevented = true; } });
assert.equal(prevented, false, "Background disclosures must not prevent native dialog Escape dismissal");
assert.equal(modal.details.open, true);
modal.escape({ defaultPrevented: true });
assert.equal(modal.details.dataset.expanded, "true", "Previously handled keyboard events must be respected");
modal.escape(); modal.advance(200);
assert.equal(modal.details.open, false);
modal.unmount();

const linked = harness({ hash: "#project-research" });
assert.equal(linked.details.open, true, "A direct research URL must reveal content immediately");
linked.frame();
assert.equal(linked.document.activeElement, linked.summary, "Deep links focus the revealed summary");
linked.leave(); linked.blur(); linked.advance(1000);
assert.equal(linked.details.open, true, "Linked content remains open after focus departure");
linked.click(); linked.advance(200);
assert.equal(linked.details.open, false);
linked.follow("#project-research");
assert.equal(linked.details.open, true, "Following the same fragment reopens an explicitly closed project");
linked.unmount();

const changed = harness();
changed.hash("#unrelated"); changed.hash("#%E0%A4%A");
assert.equal(changed.details.open, false, "Unrelated and malformed hashes must be ignored safely");
changed.follow("#project-research", { ctrlKey: true });
assert.equal(changed.details.open, false, "Modified links preserve browser new-tab behavior");
changed.hash("#project%2Dresearch");
assert.equal(changed.details.open, true, "Fragments decode and open the addressed disclosure");
changed.unmount();

const printClosed = harness();
printClosed.print();
assert.equal(printClosed.details.open, true, "Printing includes closed disclosure content");
printClosed.print(); printClosed.afterPrint();
assert.equal(printClosed.details.open, false, "Repeated print events preserve the original closed state");
printClosed.click(); printClosed.advance(80); printClosed.print();
assert.equal(printClosed.details.open, true);
printClosed.afterPrint();
assert.equal(printClosed.details.open, true, "Printing restores the requested open state");
printClosed.click(); printClosed.advance(80); printClosed.print();
assert.equal(printClosed.details.open, true);
printClosed.afterPrint();
assert.equal(printClosed.details.open, false, "Printing during a closing animation restores closed content");
printClosed.unmount();

const printOpen = harness({ open: true });
printOpen.print(); printOpen.afterPrint();
assert.equal(printOpen.details.open, true);
printOpen.click(); printOpen.advance(200);
assert.equal(printOpen.details.open, false, "Printing preserves the next explicit toggle");
printOpen.unmount();

const staleTour = harness({ expeditionStop: "research" });
staleTour.tour("research"); staleTour.advance(1000);
assert.equal(staleTour.details.open, false, "Old guided-stop events must never expand content");
staleTour.unmount();

console.log("PASS: pointer/focus stability, explicit activation, focused Escape, dialog isolation, animation reversal, reduced motion, direct/repeated fragments, print restoration, and cleanup.");
