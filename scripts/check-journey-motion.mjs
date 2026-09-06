import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the actual effect with deterministic scroll input and frame timing.
// This verifies the camera without requiring a browser or changing page scroll.
const source = ts.transpileModule(readFileSync(new URL("../app/JourneyMotion.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function mount(initialY = 9000, reduceMotion = false, options = {}) {
  const { width = 1440, height = 900, viewportHeight = height, finePointer = true } = options;
  let time = 0;
  let serial = 0;
  let cleanup;
  let measuredRects = 0;
  const frames = new Map();
  const listeners = new Map();
  const styles = new Map();
  const media = new Map();
  const context = {
    exports: {}, scrollY: initialY, innerWidth: width, innerHeight: viewportHeight,
    performance: { now: () => time },
    require: (name) => {
      assert.equal(name, "react");
      return { useEffect: (effect) => { cleanup = effect(); } };
    },
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
    ResizeObserver: class { observe() {} disconnect() {} },
    matchMedia: (query) => {
      const callbacks = new Set();
      const value = {
        matches: query.includes("reduced-motion") ? reduceMotion : finePointer,
        addEventListener: (_name, callback) => callbacks.add(callback),
        removeEventListener: (_name, callback) => callbacks.delete(callback),
        change(matches) { this.matches = matches; callbacks.forEach((callback) => callback()); },
        listeners: callbacks,
      };
      media.set(query, value);
      return value;
    },
  };
  function element(name, top = 0, elementHeight = height, elementWidth = width) {
    const properties = new Map();
    styles.set(name, properties);
    const node = {
      clientHeight: elementHeight, clientWidth: elementWidth,
      style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) },
      getBoundingClientRect: () => {
        measuredRects += 1;
        return { top: top - context.scrollY, height: node.clientHeight, width: node.clientWidth };
      },
      addEventListener() {}, removeEventListener() {},
    };
    return node;
  }
  const root = element("root");
  root.dataset = { expeditionMode: options.guided ? "guided" : "free" };
  root.scrollHeight = 15500;
  const world = element("world");
  const progressBar = element("progress");
  const threshold = element("threshold", 8000, 2205);
  const story = element("story");
  const worldNodes = new Map([
    [".journey-world__realm--surface", element("surface")],
    [".journey-world__realm--continuum", element("continuum")],
    [".journey-world__realm--depth", element("depth")],
    [".journey-world__continuum-plate", element("plate", 0, options.plateHeight ?? 3025, options.plateWidth ?? 1600)],
    ...["back", "atmosphere", "mid", "near"].map((plane, index) => [
      `.journey-world__depth-layer--${plane} img`, element(plane, 0, 2400 + index * 250),
    ]),
  ]);
  world.querySelector = (selector) => worldNodes.get(selector);
  world.querySelectorAll = () => [];
  const sections = new Map([
    ["crust", element("crust", 10205, 1200)],
    ["experience", element("experience", 11405, 1300)],
    ["about", element("about", 12705, 1200)],
    ["contact", element("contact", 13905, 1595)],
  ]);
  context.document = {
    documentElement: root,
    querySelector: (selector) => new Map([[".journey-world", world], [".descent-threshold", threshold], [".journey__story", story], [".scroll-progress", progressBar]]).get(selector),
    getElementById: (id) => sections.get(id),
    addEventListener() {}, removeEventListener() {},
  };
  vm.runInNewContext(source, context);
  context.exports.JourneyMotion();
  return {
    value: (node, property) => Number.parseFloat(styles.get(node).get(property) ?? "0"),
    scroll: (y) => { context.scrollY = y; listeners.get("scroll")?.(); },
    pointer: (x, y) => listeners.get("pointermove")?.({ pointerType: "mouse", clientX: x, clientY: y }),
    frame: (elapsed = 1000 / 60) => {
      time += elapsed;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
    },
    settle: () => {
      for (let i = 0; i < 300 && frames.size; i++) {
        time += 1000 / 60;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback(time));
      }
      assert.equal(frames.size, 0, "The camera must stop requesting frames once settled");
    },
    pending: () => frames.size,
    measurements: () => measuredRects,
    properties: (node) => styles.get(node),
    resize: (newWidth, newHeight, worldHeight = world.clientHeight) => {
      context.innerWidth = newWidth;
      context.innerHeight = newHeight;
      world.clientHeight = worldHeight;
      world.clientWidth = newWidth;
      listeners.get("resize")?.();
    },
    finePointer: (matches) => media.get("(hover: hover) and (pointer: fine)").change(matches),
    mediaListeners: () => [...media.values()].reduce((count, value) => count + value.listeners.size, 0),
    guided: (value) => { root.dataset.expeditionMode = value ? "guided" : "free"; },
    unmount: () => cleanup(),
  };
}

const camera = mount();
const initial = camera.value("continuum", "--continuum-y");
camera.scroll(9300);
camera.frame();
const first = camera.value("continuum", "--continuum-y");
assert(camera.pending() > 0, "A wheel step must ease across frames, not jump straight to raw scroll");
camera.settle();
const final = camera.value("continuum", "--continuum-y");
assert(first < initial && first > final, "The camera must approach its destination without overshoot");
camera.scroll(9000);
camera.settle();
assert(Math.abs(camera.value("continuum", "--continuum-y") - initial) < .1, "Reverse scrolling must return to the same camera position");
camera.unmount();
assert.equal(camera.pending(), 0);

const atRate = (rate) => {
  const engine = mount();
  engine.scroll(9300);
  for (let i = 0; i < rate / 5; i++) engine.frame(1000 / rate);
  const position = engine.value("continuum", "--continuum-y");
  engine.unmount();
  return position;
};
assert(Math.abs(atRate(60) - atRate(120)) < .1, "Camera smoothing must be refresh-rate independent");

const lookAtRate = (rate) => {
  const engine = mount(0);
  engine.pointer(1440, 900);
  for (let i = 0; i < rate / 5; i++) engine.frame(1000 / rate);
  const position = engine.value("world", "--look-x");
  engine.settle();
  assert.equal(engine.value("world", "--look-x").toFixed(1), "-11.0", "Pointer motion must approach the requested position");
  engine.unmount();
  return position;
};
assert(Math.abs(lookAtRate(60) - lookAtRate(120)) <= .02, "Mouse parallax must move equally far after the same time at 60 and 120 Hz");

const positionAt = (y) => {
  const engine = mount(y);
  const position = engine.value("continuum", "--continuum-y");
  engine.unmount();
  return position;
};
const distances = [[8200, 8400], [8600, 8800], [9000, 9200]].map(([a, b]) => positionAt(a) - positionAt(b));
assert(Math.max(...distances) - Math.min(...distances) < .1, "Equal scroll distances inside the cave must produce a steady glide");

for (let y = 7000; y <= 10500; y += 25) {
  const engine = mount(y);
  const surface = engine.value("surface", "--surface-realm-opacity");
  const continuum = engine.value("continuum", "--continuum-realm-opacity");
  const underground = engine.value("depth", "--depth-realm-opacity");
  assert(1 - (1 - surface) * (1 - continuum) * (1 - underground) >= .999, "The cave handoff must never expose the dark canvas");
  engine.unmount();
}

const interrupted = mount();
interrupted.scroll(9300);
interrupted.frame();
assert(interrupted.pending() > 0);
interrupted.unmount();
assert.equal(interrupted.pending(), 0, "Unmount must cancel an in-flight camera animation");

const depth = mount(11000);
assert(Math.abs(depth.value("depth", "--depth-near-x")) > 1, "Underground layers must retain the original lateral camera motion");
depth.unmount();

const reduced = mount(9000, true);
reduced.scroll(9300);
reduced.frame();
assert.equal(reduced.pending(), 0, "Reduced motion must not schedule camera settling");
reduced.unmount();

const phoneViewport = { width: 390, height: 844, viewportHeight: 744, plateHeight: 1999, plateWidth: 390, finePointer: false };
const phone = mount(9000, false, phoneViewport);
const phoneDestination = mount(9300, false, phoneViewport);
assert.notEqual(phone.value("continuum", "--continuum-y"), phoneDestination.value("continuum", "--continuum-y"), "The mobile test must exercise a moving cave plate");
phone.scroll(9200);
phone.scroll(9250);
phone.scroll(9300);
assert.equal(phone.pending(), 1, "Touch scroll events must coalesce into one frame");
phone.frame();
assert.equal(phone.value("continuum", "--continuum-y"), phoneDestination.value("continuum", "--continuum-y"), "Touch camera must match the latest native scroll position in one frame");
assert.equal(phone.pending(), 0, "Touch scrolling must not leave an easing tail after native scrolling stops");
assert.equal(phone.properties("root").size, 0, "Scroll progress must not invalidate inherited properties across the whole document");
assert(phone.value("progress", "--page-progress") > 0, "The progress bar must still reflect native scroll");
const beforeToolbar = phone.measurements();
const beforeToolbarPosition = phone.value("continuum", "--continuum-y");
phone.resize(390, 844);
phone.frame();
assert.equal(phone.measurements(), beforeToolbar, "A height-only browser toolbar change must not remeasure the scene");
assert.equal(phone.value("continuum", "--continuum-y"), beforeToolbarPosition, "Browser chrome must not shift the camera at the same scroll offset");
phone.resize(844, 390, 390);
phone.frame();
assert(phone.measurements() > beforeToolbar, "Orientation changes must still remeasure scene geometry");
phone.unmount();
phoneDestination.unmount();
assert.equal(phone.mediaListeners(), 0, "Unmount must remove both motion and pointer capability listeners");

const hybrid = mount(0);
hybrid.pointer(1440, 900);
hybrid.frame();
assert(hybrid.pending() > 0);
hybrid.finePointer(false);
hybrid.frame();
assert.equal(hybrid.value("world", "--look-x"), 0, "Losing mouse capability must clear its parallax");
assert.equal(hybrid.pending(), 0, "Switching to touch must not retain mouse or scroll easing work");
hybrid.unmount();

const directed = mount(9000, false, { guided: true });
const directedDestination = mount(9300, false, { guided: true });
directed.scroll(9300);
directed.frame();
assert.equal(directed.value("continuum", "--continuum-y"), directedDestination.value("continuum", "--continuum-y"), "The painted camera must not add another easing layer over director scroll");
assert.equal(directed.pending(), 0, "Guided camera tracking must have no independent settling tail");
directed.guided(false);
directed.scroll(9000);
directed.frame();
assert(directed.pending() > 0, "Free desktop scrolling must retain its original camera follow");
directed.unmount();
directedDestination.unmount();

console.log("PASS: desktop easing, native touch sync, scoped progress, stable mobile toolbar geometry, orientation/capability changes, 60/120 Hz consistency, opaque handoff, reduced motion, and cleanup.");
