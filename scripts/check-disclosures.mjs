import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/InteractiveDisclosures.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function harness({ open = false, hoverable = true, reduced = false, hash = "", expeditionStop = "" } = {}) {
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
  const hover = { ...makeEvents(), matches: hoverable };
  const motion = { ...makeEvents(), matches: reduced };
  const context = {
    exports: {}, document, window,
    require: () => ({ useEffect: (effect) => { cleanup = effect(); } }),
    matchMedia: (query) => query.includes("reduced-motion") ? motion : hover,
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
      assert.equal(timers.size, 0, "Unmount must clear pending animation and hover timers");
      assert.equal(frames.size, 0, "Unmount must cancel pending focus callbacks");
    },
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
assert.equal(pinned.details.dataset.pinned, "false", "Hover preview must advertise the keep-open action");
pinned.click();
assert.equal(pinned.details.dataset.pinned, "true", "A pinned preview must advertise the close action");
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

const modal = harness();
modal.enter();
modal.advance(380);
let prevented = false;
modal.escape({ target: { closest: () => ({ open: true }) }, preventDefault: () => { prevented = true; } });
assert.equal(prevented, false, "An underlying hover preview must not prevent native dialog Escape dismissal");
assert.equal(modal.details.dataset.expanded, "true", "Dialog-local input must leave background disclosures untouched");
modal.escape({ defaultPrevented: true });
assert.equal(modal.details.dataset.expanded, "true", "Previously handled keyboard events must be respected");
modal.escape();
modal.advance(200);
assert.equal(modal.details.open, false, "Escape must still dismiss a preview outside dialogs");
modal.unmount();

const linked = harness({ hash: "#project-research" });
assert.equal(linked.details.open, true, "A direct research URL must reveal its content immediately");
linked.frame();
assert.equal(linked.document.activeElement, linked.summary, "Deep links must place keyboard focus on the revealed summary");
linked.leave();
linked.blur();
linked.advance(1000);
assert.equal(linked.details.open, true, "Hash navigation must pin content after the pointer and focus leave");
linked.click();
linked.advance(200);
assert.equal(linked.details.open, false, "A linked project must still close on the first explicit click");
linked.follow("#project-research");
assert.equal(linked.details.open, true, "Following the same hash again must reopen a closed project");
linked.unmount();

const changed = harness();
changed.hash("#unrelated");
changed.hash("#%E0%A4%A");
assert.equal(changed.details.open, false, "Unrelated and malformed hashes must be ignored safely");
changed.follow("#project-research", { ctrlKey: true });
assert.equal(changed.details.open, false, "Modified link activation must preserve browser new-tab behavior");
changed.hash("#project%2Dresearch");
assert.equal(changed.details.open, true, "Hash changes must decode and open the addressed disclosure");
changed.unmount();

const printClosed = harness();
printClosed.print();
assert.equal(printClosed.details.open, true, "Printing must include closed disclosure content");
printClosed.print();
printClosed.afterPrint();
assert.equal(printClosed.details.open, false, "Repeated print events must preserve the original closed state");
printClosed.click();
printClosed.advance(80);
printClosed.print();
assert.equal(printClosed.details.open, true, "Printing must settle an opening animation");
printClosed.afterPrint();
assert.equal(printClosed.details.open, true, "Printing must restore the requested open state");
printClosed.click();
printClosed.advance(80);
printClosed.print();
assert.equal(printClosed.details.open, true);
printClosed.afterPrint();
assert.equal(printClosed.details.open, false, "Printing during a closing animation must restore closed content");
printClosed.unmount();

const printOpen = harness({ open: true });
printOpen.print();
printOpen.afterPrint();
assert.equal(printOpen.details.open, true, "Initially open content must remain open after printing");
printOpen.click();
printOpen.advance(200);
assert.equal(printOpen.details.open, false, "Printing must preserve pin state for the next explicit toggle");
printOpen.unmount();

const tour = harness({ expeditionStop: "research" });
tour.tour("unrelated");
assert.equal(tour.details.open, false, "A guided stop may reveal only its matching disclosure");
tour.tour("research"); tour.advance(260);
assert.equal(tour.details.open, true);
assert.equal(tour.details.dataset.pinned, "true", "Guided reading remains open after the arrival animation");
assert.equal(tour.document.activeElement, null, "Guided arrival must not steal keyboard focus");
tour.leave(); tour.advance(1000);
assert.equal(tour.details.open, true);
tour.click(); tour.advance(200);
tour.tour("research"); tour.advance(1000);
assert.equal(tour.details.open, false, "Returning to a visited stop must respect a later manual close");
tour.unmount();

const manualBeforeTour = harness({ expeditionStop: "research" });
manualBeforeTour.click(); manualBeforeTour.advance(260);
manualBeforeTour.click(); manualBeforeTour.advance(200);
manualBeforeTour.leave();
manualBeforeTour.tour("research"); manualBeforeTour.advance(1000);
assert.equal(manualBeforeTour.details.open, false, "A manual close before arrival must survive pointer departure and suppress the guided reveal");
manualBeforeTour.unmount();

console.log("PASS: hover, pinning, keyboard, modal Escape, touch, animation reversal, reduced motion, deep links, repeat links, guided matching/once/manual-close/focus behavior, print restoration, and cleanup.");
