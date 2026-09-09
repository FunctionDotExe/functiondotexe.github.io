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
  let observedResize;
  let measuredRects = 0;
  const frames = new Map();
  const listeners = new Map();
  const documentListeners = new Map();
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
    ResizeObserver: class { constructor(callback) { observedResize = callback; } observe() {} disconnect() {} },
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
      clientHeight: elementHeight, clientWidth: elementWidth, documentTop: top,
      style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) },
      getBoundingClientRect: () => {
        measuredRects += 1;
        return { top: node.documentTop - context.scrollY, height: node.clientHeight, width: node.clientWidth };
      },
      addEventListener() {}, removeEventListener() {},
    };
    return node;
  }
  const root = element("root");
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
    [".journey-world__dusk", element("dusk")],
    [".journey-world__stars", element("stars")],
    [".journey-world__continuum-dusk", element("continuum-dusk")],
    [".journey-world__core-light", element("core-light")],
    ...["sky", "clouds", "valley", "trail", "foreground"].map((layer) => [`.journey-world__layer--${layer}`, element(layer)]),
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
    hidden: false,
    documentElement: root,
    querySelector: (selector) => new Map([[".journey-world", world], [".descent-threshold", threshold], [".journey__story", story], [".scroll-progress", progressBar]]).get(selector),
    getElementById: (id) => sections.get(id),
    addEventListener: (name, callback) => documentListeners.set(name, callback),
    removeEventListener: (name) => documentListeners.delete(name),
  };
  vm.runInNewContext(source, context);
  context.exports.JourneyMotion();
  return {
    value: (node, property) => Number.parseFloat(styles.get(node).get(property) ?? "0"),
    translationY: (node) => Number(styles.get(node).get("transform")?.match(/,\s*(-?[\d.]+)px,\s*0\)/)?.[1] ?? 0),
    translationX: (node) => Number(styles.get(node).get("transform")?.match(/calc\(-50% \+ (-?[\d.]+)px\)/)?.[1] ?? 0),
    blur: () => Number(styles.get("world").get("filter")?.match(/^blur\(([\d.]+)px\)$/)?.[1] ?? 0),
    nativeY: () => context.scrollY,
    nativeProgress: () => `scaleX(${(context.scrollY / (root.scrollHeight - context.innerHeight)).toFixed(4)})`,
    scroll: (y) => { context.scrollY = y; listeners.get("scroll")?.(); },
    pointer: (x, y) => listeners.get("pointermove")?.({ pointerType: "mouse", clientX: x, clientY: y }),
    frame: (elapsed = 1000 / 60) => {
      time += elapsed;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
    },
    settle: () => {
      for (let i = 0; i < 60 && frames.size; i++) {
        time += 1000 / 60;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback(time));
      }
      assert.equal(frames.size, 0, "The camera and blur must settle and stop requesting frames within one second");
    },
    pending: () => frames.size,
    measurements: () => measuredRects,
    properties: (node) => styles.get(node),
    styleEntries: () => [...styles.values()].flatMap((properties) => [...properties.entries()]),
    filteredNodes: () => [...styles.entries()].filter(([, properties]) => properties.has("filter")).map(([name]) => name),
    expandSection: (id, delta) => {
      const section = sections.get(id);
      for (const next of sections.values()) if (next.documentTop > section.documentTop) next.documentTop += delta;
      section.clientHeight += delta;
      root.scrollHeight += delta;
      observedResize();
    },
    resize: (newWidth, newHeight, worldHeight = world.clientHeight) => {
      context.innerWidth = newWidth;
      context.innerHeight = newHeight;
      world.clientHeight = worldHeight;
      world.clientWidth = newWidth;
      listeners.get("resize")?.();
    },
    finePointer: (matches) => media.get("(hover: hover) and (pointer: fine)").change(matches),
    reducedMotion: (matches) => media.get("(prefers-reduced-motion: reduce)").change(matches),
    mediaListeners: () => [...media.values()].reduce((count, value) => count + value.listeners.size, 0),
    hidden: (value) => { context.document.hidden = value; documentListeners.get("visibilitychange")?.(); },
    unmount: () => { cleanup(); assert.equal(documentListeners.size, 0); assert([...styles.values()].every((properties) => properties.size === 0), "Unmount must clear only the scenery styles it owns"); },
  };
}

const camera = mount();
const initial = camera.translationY("plate");
const destination = mount(9300);
const lagLimit = mount(9236);
const beforeMotionMeasurements = camera.measurements();
camera.scroll(9300);
camera.frame();
assert.equal(camera.pending(), 1, "Decorative scenery should retain a short glide after native input");
assert(camera.translationY("plate") > destination.translationY("plate"), "The first frame should glide toward the destination without overshooting");
assert(camera.translationY("plate") <= lagLimit.translationY("plate"), "Desktop scenery may lag native scroll by no more than 64 pixels");
assert(camera.translationY("plate") < initial, "The scenery must start moving on the first frame");
assert.equal(camera.nativeY(), 9300, "Decorative smoothing must never rewrite native scroll");
assert.equal(camera.properties("progress").get("transform"), camera.nativeProgress(), "The progress bar must track actual scroll while scenery glides");
assert(camera.blur() > 0 && camera.blur() <= 1.2, "Desktop movement should add only a restrained blur");
assert.deepEqual(camera.filteredNodes(), ["world"], "Blur belongs only to the clipped decorative world, never text or source plates");
camera.settle();
assert.equal(camera.translationY("plate"), destination.translationY("plate"), "Settling must reach the exact native destination");
assert.equal(camera.properties("world").get("filter"), "none", "The filter must be removed completely at rest");
assert.equal(camera.measurements(), beforeMotionMeasurements, "Animation frames must reuse cached scene geometry");
destination.unmount();
lagLimit.unmount();
camera.scroll(9000);
camera.settle();
assert(Math.abs(camera.translationY("plate") - initial) < .1, "Reverse scrolling must return to the same camera position");
camera.unmount();
assert.equal(camera.pending(), 0);

const atRate = (rate) => {
  const engine = mount();
  engine.scroll(9300);
  for (let i = 0; i < rate / 5; i++) engine.frame(1000 / rate);
  const position = engine.translationY("plate");
  engine.unmount();
  return position;
};
assert(Math.abs(atRate(60) - atRate(120)) < .1, "The decorative glide must cover the same distance after 200 ms at 60 and 120 Hz");

// Sustained quick input must stay bounded, then anchor jumps must land cleanly.
const rapid = mount(8000);
for (let y = 8050; y <= 9500; y += 50) {
  rapid.scroll(y);
  rapid.frame(1000 / 120);
  assert(rapid.blur() <= 1.2, "Fast sustained scrolling must never exceed the blur cap");
}
assert(rapid.blur() > 0, "The velocity effect should remain visible during sustained scrolling");
rapid.scroll(11000);
rapid.frame();
const jumpDestination = mount(11000);
assert.equal(rapid.translationY("near"), jumpDestination.translationY("near"), "Large navigation jumps must snap the scenery to the destination");
assert.equal(rapid.properties("world").get("filter"), "none", "Anchor jumps must clear blur velocity history");
assert.equal(rapid.pending(), 0, "An anchor jump must leave no settling animation");
rapid.unmount();
jumpDestination.unmount();

const lookAtRate = (rate) => {
  const engine = mount(0);
  engine.pointer(1440, 900);
  for (let i = 0; i < rate / 5; i++) engine.frame(1000 / rate);
  const position = engine.value("foreground", "translate");
  engine.settle();
  assert.equal(engine.value("foreground", "translate").toFixed(1), "-11.0", "Pointer motion must follow the actual mouse position");
  assert.equal(engine.pending(), 0, "Pointer input must not retain a separate settling loop");
  engine.unmount();
  return position;
};
assert(Math.abs(lookAtRate(60) - lookAtRate(120)) <= .02, "Mouse parallax must move equally far after the same time at 60 and 120 Hz");

const positionAt = (y, plane = "plate", options = {}) => {
  const engine = mount(y, false, options);
  const position = engine.translationY(plane);
  engine.unmount();
  return position;
};
const distances = [[8200, 8400], [8600, 8800], [9000, 9200]].map(([a, b]) => positionAt(a) - positionAt(b));
assert(Math.max(...distances) - Math.min(...distances) < .1, "Equal scroll distances inside the cave must produce a steady glide");

for (let y = 7000; y <= 10500; y += 25) {
  const engine = mount(y);
  const surface = engine.value("surface", "opacity");
  const continuum = engine.value("continuum", "opacity");
  const underground = engine.value("depth", "opacity");
  assert(1 - (1 - surface) * (1 - continuum) * (1 - underground) >= .999, "The cave handoff must never expose the dark canvas");
  engine.unmount();
}

const passingCave = mount(7000);
for (let y = 7025; y <= 10500; y += 25) {
  passingCave.scroll(y);
  passingCave.frame();
  const surface = passingCave.value("surface", "opacity");
  const continuum = passingCave.value("continuum", "opacity");
  const underground = passingCave.value("depth", "opacity");
  assert(1 - (1 - surface) * (1 - continuum) * (1 - underground) >= .999, "The handoff must remain opaque while scenery is still gliding");
}
passingCave.unmount();

const interrupted = mount();
interrupted.scroll(9300);
assert(interrupted.pending() > 0);
interrupted.unmount();
assert.equal(interrupted.pending(), 0, "Unmount must cancel an in-flight camera animation");

const depth = mount(11000);
assert(Math.abs(depth.translationX("near")) > 1, "Underground layers must retain the original lateral camera motion");
depth.unmount();

// Ten-pixel intervals around the three interior landmarks catch the old
// ease-to-a-stop behavior without depending on a particular spline formula.
for (const anchor of [10370, 11605, 12863]) {
  const before = positionAt(anchor - 10, "near");
  const at = positionAt(anchor, "near");
  const after = positionAt(anchor + 10, "near");
  assert(before - at > 1.5 && at - after > 1.5, "Underground scenery must keep descending through each interior landmark");
  assert(Math.abs((before - at) - (at - after)) < .5, "Vertical velocity should stay continuous across underground landmarks");
}
let previousDepth = positionAt(9900, "near");
for (let y = 9950; y <= 14400; y += 50) {
  const next = positionAt(y, "near");
  assert(next < previousDepth, "The underground journey must descend monotonically without reversing or freezing");
  previousDepth = next;
}

const reduced = mount(9000, true);
const reducedInitial = reduced.translationY("near");
reduced.scroll(9300);
reduced.frame();
assert.equal(reduced.pending(), 0, "Reduced motion must not schedule camera settling");
assert.equal(reduced.translationY("near"), reducedInitial, "Reduced motion must retain a static underground composition");
assert.equal(reduced.properties("world").get("filter"), "none", "Reduced motion must never add motion blur");
reduced.unmount();

const changedPreference = mount();
changedPreference.scroll(9300);
changedPreference.frame();
assert(changedPreference.blur() > 0);
changedPreference.reducedMotion(true);
changedPreference.frame();
assert.equal(changedPreference.properties("world").get("filter"), "none", "Enabling reduced motion must clear an active blur immediately");
assert.equal(changedPreference.pending(), 0, "Enabling reduced motion must stop an active glide");
changedPreference.unmount();

const phoneViewport = { width: 390, height: 844, viewportHeight: 744, plateHeight: 1999, plateWidth: 390, finePointer: false };
const phone = mount(9000, false, phoneViewport);
const phoneDestination = mount(9300, false, phoneViewport);
assert.notEqual(phone.translationY("plate"), phoneDestination.translationY("plate"), "The mobile test must exercise a moving cave plate");
phone.scroll(9200);
phone.scroll(9250);
phone.scroll(9300);
assert.equal(phone.pending(), 1, "Touch scroll events must coalesce into one frame");
phone.frame();
const phoneLagLimit = positionAt(9268, "plate", phoneViewport);
assert(phone.translationY("plate") > phoneDestination.translationY("plate"), "Touch scenery should have a short decorative glide");
assert(phone.translationY("plate") <= phoneLagLimit, "Touch scenery may lag the latest native position by no more than 32 pixels");
assert(phone.blur() > 0 && phone.blur() <= .7, "Touch motion blur must stay below its smaller cap");
assert.equal(phone.properties("root").size, 0, "Scroll progress must not invalidate inherited properties across the whole document");
assert.equal(phone.properties("progress").get("transform"), phone.nativeProgress(), "Touch progress must reflect actual scroll immediately");
assert(phone.styleEntries().every(([name]) => !name.startsWith("--")), "Frame updates must use actual layer transform/opacity properties, never inherited scene-wide variables");
phone.settle();
assert.equal(phone.translationY("plate"), phoneDestination.translationY("plate"), "Touch scenery must settle at the exact native destination");
assert.equal(phone.properties("world").get("filter"), "none", "Touch motion blur must disappear at rest");
const beforeToolbar = phone.measurements();
const beforeToolbarPosition = phone.translationY("plate");
phone.resize(390, 844);
phone.frame();
assert.equal(phone.measurements(), beforeToolbar, "A height-only browser toolbar change must not remeasure the scene");
assert.equal(phone.translationY("plate"), beforeToolbarPosition, "Browser chrome must not shift the camera at the same scroll offset");
phone.resize(844, 390, 390);
phone.frame();
assert(phone.measurements() > beforeToolbar, "Orientation changes must still remeasure scene geometry");
phone.unmount();
phoneDestination.unmount();
assert.equal(phone.mediaListeners(), 0, "Unmount must remove both motion and pointer capability listeners");

const expanding = mount(11800);
expanding.scroll(12000);
expanding.frame();
const beforeExpansion = expanding.measurements();
expanding.expandSection("experience", 600);
expanding.frame();
assert(expanding.measurements() > beforeExpansion, "Disclosure expansion must invalidate the underground camera anchors");
assert(Number.isFinite(expanding.translationY("near")), "Changing section heights must keep the camera position finite");
assert.equal(expanding.nativeY(), 12000, "Disclosure remeasurement must not move native scroll");
assert.equal(expanding.properties("progress").get("transform"), expanding.nativeProgress(), "Disclosure expansion must update native progress for the new page length");
assert.equal(expanding.properties("world").get("filter"), "none", "Geometry changes must not create a false blur impulse");
assert.equal(expanding.pending(), 0, "Geometry changes must establish a clean camera baseline");
expanding.unmount();

const hybrid = mount(0);
hybrid.pointer(1440, 900);
assert(hybrid.pending() > 0);
hybrid.frame();
assert.equal(hybrid.pending(), 0);
hybrid.finePointer(false);
hybrid.frame();
assert.equal(hybrid.value("foreground", "translate"), 0, "Losing mouse capability must clear its parallax");
assert.equal(hybrid.pending(), 0, "Switching to touch must not retain mouse or scroll easing work");
hybrid.unmount();

const hidden = mount();
hidden.scroll(9300); hidden.hidden(true);
assert.equal(hidden.pending(), 0, "Hidden pages must cancel pending scenery work");
hidden.scroll(9500);
assert.equal(hidden.pending(), 0);
hidden.hidden(false); hidden.frame();
assert.equal(hidden.translationY("plate"), positionAt(9500));
assert.equal(hidden.pending(), 0);
hidden.unmount();

console.log("PASS: native scroll/progress, bounded desktop/touch scenery glide, 60/120 Hz consistency, capped decorative blur with idle cleanup, uninterrupted underground descent, cached geometry, opaque cave handoff, stable mobile toolbars, disclosure reflow, reduced motion, hidden-page suspension and cleanup.");
