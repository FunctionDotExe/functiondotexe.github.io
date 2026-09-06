import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const pacing = { exports: {} };
vm.runInNewContext(compile("../lib/expedition-pacing.ts"), pacing);
const { ExpeditionPacing } = pacing.exports;
const stops = [100, 300, 500, 800].map((y, i) => ({ id: `stop-${i}`, label: `Beat ${i}`, scene: i < 2 ? "first" : "second", y, duration: 2000 }));
const gate = new ExpeditionPacing(stops, 0, 1200);
gate.input(1e6, 0);
assert.equal(gate.target, 100, "A huge gesture must stop at the very next beat");
assert.equal(gate.hold.startedAt, null, "Reading time must not begin while approaching the beat");
let time = 0;
while (gate.hold.startedAt === null && time < 2000) { time += 16; gate.tick(time); }
assert.equal(gate.position, 100);
const arrived = time;
for (let i = 0; i < 20; i++) gate.input(1e6, arrived + i * 20);
gate.tick(arrived + 1999);
assert.equal(gate.position, 100, "Rapid input cannot shorten a dwell");
gate.tick(arrived + 2000);
assert.equal(gate.hold, null);
assert.equal(gate.moving, false, "Old input must not start an unattended tour after the pause");
gate.input(900, arrived + 2100);
assert.equal(gate.target, 300, "The next gesture must encounter the next beat");
gate.input(-60, arrived + 2110);
assert.equal(gate.hold, null, "Reversing must exit a pending or active pause immediately");
assert(gate.target < gate.position);
gate.reset(600);
gate.input(-800, 5000);
assert.equal(gate.target, 500, "Reverse travel must also encounter the next beat along its direction");
gate.reset(320);
assert.equal(gate.skipTarget(), 500, "Skipping a scene must bypass its remaining beats");
gate.reset(900);
assert.equal(gate.skipTarget(), 1200, "Skipping the last scene reaches the end");
const fractional = new ExpeditionPacing(stops, 99.75, 1200);
fractional.input(300, 0);
assert.equal(fractional.target, 100, "Fractional scroll positions just before a marker must not skip its dwell");

const continued = new ExpeditionPacing(stops, 0, 1200);
continued.input(500, 0);
for (let now = 0; now < 1000; now += 16) continued.tick(now);
const deadline = continued.hold.startedAt + 2000;
continued.input(500, deadline - 50);
continued.tick(deadline);
assert.equal(continued.target, 300, "A gesture still in progress may continue exactly to the next stop");
assert.equal(continued.hold.startedAt, null, "The next stop gets a fresh full pause after arrival");
const clamped = new ExpeditionPacing([{ ...stops[0], duration: Infinity }, { ...stops[1], duration: 90000 }], 0, 1000);
assert.equal(clamped.stops[0].duration, 2000);
assert.equal(clamped.stops[1].duration, 4000, "Metadata cannot create an unbounded lock");
clamped.input(NaN, 0);
assert.equal(clamped.target, 0);
assert.equal(clamped.tick(NaN), 0);
const atRate = (rate) => {
  const model = new ExpeditionPacing([], 0, 2000);
  model.tick(0); model.input(500, 0);
  for (let now = 1000 / rate; now <= 200.01; now += 1000 / rate) model.tick(now);
  return model.position;
};
assert(Math.abs(atRate(60) - atRate(120)) < .001, "Travel smoothing must use elapsed time, not frame count");

function events() {
  const map = new Map();
  return {
    map,
    addEventListener(name, callback) { if (!map.has(name)) map.set(name, new Set()); map.get(name).add(callback); },
    removeEventListener(name, callback) { map.get(name)?.delete(callback); if (!map.get(name)?.size) map.delete(name); },
    dispatchEvent(event) { [...(map.get(event.type) ?? [])].forEach((callback) => callback(event)); return true; },
    fire(type, event = {}) { this.dispatchEvent({ type, ...event }); },
  };
}
const directorSource = compile("../components/summit/ExpeditionDirector.tsx");
function mount({ reduced = false, storedMode = null, projectMode = false, skillMode = false, readingTop = 200, integerScroll = false } = {}) {
  let now = 0, serial = 0, cleanup, resizeCallback, modal = null;
  const frames = new Map();
  const refs = [];
  const views = [];
  const calls = [];
  const announcements = [];
  let layoutShift = 0;
  const preference = { ...events(), matches: reduced };
  class Element {
    constructor(tag = "div") { this.tag = tag; this.dataset = {}; this.parentElement = null; this.scrollHeight = this.clientHeight = 100; this.overflow = "visible"; this.attrs = new Map(); this.classes = new Set(); this.classList = { contains: (name) => this.classes.has(name) }; this.style = { overflow: "", setProperty() {}, removeProperty() {} }; }
    setAttribute(name, value) { this.attrs.set(name, value); }
    getAttribute(name) { return this.attrs.get(name) ?? null; }
    removeAttribute(name) { this.attrs.delete(name); }
    closest(selector) {
      if (selector.includes(".expedition-director") && this.tag === "director") return this;
      if (selector.includes(".crystal-scene") && this.tag === "crystal") return this;
      if (selector.includes(".project-chapter") && this.classes.has("project-chapter")) return this;
      if (selector.includes("article[id]") && this.tag === "article") return this;
      if (selector.includes("dialog") && this.tag === "dialog") return this;
      if (selector.includes(this.tag) && ["input", "textarea", "select", "button", "a"].includes(this.tag)) return this;
      return this.parentElement?.closest(selector) ?? null;
    }
  }
  const root = new Element("html"); root.scrollHeight = 1800;
  const body = new Element("body"); body.parentElement = root;
  const story = new Element(); story.clientHeight = 1800;
  const content = new Element(); content.parentElement = body;
  const nested = new Element(); nested.parentElement = content; nested.clientHeight = 100; nested.scrollHeight = 300; nested.overflow = "auto";
  const field = new Element("input"); field.parentElement = content;
  const crystal = new Element("crystal"); crystal.parentElement = content;
  const anchor = new Element("a"); anchor.parentElement = content;
  const project = new Element("article"); project.classes.add("project-chapter"); project.parentElement = content;
  const markers = stops.map((stop) => {
    const node = new Element(skillMode ? "article" : "div");
    node.dataset = { expeditionStop: stop.id, stopLabel: stop.label, stopScene: stop.scene, stopDuration: String(stop.duration) };
    if (projectMode) { node.parentElement = project; node.dataset.stopOffset = "0"; }
    if (skillMode) { node.classes.add("mineral-chapter"); node.dataset.stopOffset = "0"; }
    node.getBoundingClientRect = () => ({ top: stop.y + (projectMode || skillMode ? 0 : 80) + layoutShift - context.scrollY });
    return node;
  });
  const shots = stops.map((_, index) => {
    const node = new Element();
    node.getBoundingClientRect = () => ({ top: root.getAttribute("data-expedition-mode") === "guided" ? readingTop : 300 + index * 300 + layoutShift - context.scrollY });
    return node;
  });
  project.querySelectorAll = (selector) => selector === ".project-shot" ? shots : markers;
  const document = { ...events(), documentElement: root, body, hidden: false,
    querySelectorAll: () => markers,
    querySelector: (selector) => selector === ".journey__story" ? story : modal,
  };
  const window = events();
  const dispatch = window.dispatchEvent.bind(window);
  window.dispatchEvent = (event) => { if (event.type.startsWith("expedition:")) announcements.push(event); return dispatch(event); };
  const context = {
    exports: {}, document, window, Element, HTMLElement: Element, scrollY: 0, innerHeight: 600, innerWidth: 390,
    performance: { now: () => now }, matchMedia: () => preference,
    sessionStorage: { getItem: () => storedMode, setItem: (_key, value) => { storedMode = value; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    getComputedStyle: (node) => ({ scrollPaddingTop: "80px", overflowY: node.overflow }),
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class { constructor(callback) { resizeCallback = callback; } observe() {} disconnect() { resizeCallback = null; } },
    require(name) {
      if (name === "@/lib/expedition-pacing") return pacing.exports;
      if (name === "lucide-react") return { ArrowRight() {}, Pause() {}, Route() {} };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      assert.equal(name, "react");
      return { useEffect: (effect) => { cleanup = effect(); }, useRef: (value) => { const ref = { current: value }; refs.push(ref); return ref; }, useState: (initial) => [initial, (view) => views.push(view)] };
    },
  };
  window.scrollTo = (options) => { context.scrollY = integerScroll ? Math.round(options.top) : options.top; calls.push(options); window.fire("scroll"); };
  vm.runInNewContext(directorSource, context);
  context.exports.ExpeditionDirector();
  const frame = (duration = 16) => { now += duration; const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback(now)); };
  const wheel = (options = {}) => {
    let prevented = false;
    window.fire("wheel", { target: content, deltaX: 0, deltaY: 800, deltaMode: 0, cancelable: true, preventDefault() { prevented = true; }, ...options });
    return prevented;
  };
  const key = (key, target = content, overrides = {}) => {
    let prevented = false;
    const event = { type: "keydown", key, target, defaultPrevented: false, preventDefault() { prevented = true; this.defaultPrevented = true; }, ...overrides };
    document.dispatchEvent(event);
    window.dispatchEvent(event);
    return prevented;
  };
  return { context, root, body, document, window, preference, frames, views, calls, announcements, content, field, nested, crystal, anchor, markers,
    frame, wheel, key, controls: () => refs[0].current,
    settle() { for (let i = 0; i < 300 && frames.size; i++) frame(); assert.equal(frames.size, 0, "Controller must stop scheduling after movement and bounded dwell"); },
    modal(value) { modal = value ? new Element("dialog") : null; },
    resizeHeight(height) { context.innerHeight = height; window.fire("resize"); },
    growStory() { story.clientHeight += 100; root.scrollHeight += 100; resizeCallback?.(); },
    shiftLayout(value) { layoutShift = value; },
    nativeScroll(y) { context.scrollY = y; window.fire("scroll"); },
    unmount() { cleanup(); assert.equal(frames.size, 0); assert.equal(window.map.size + document.map.size + preference.map.size, 0); assert.equal(root.getAttribute("data-expedition-mode"), null); },
  };
}

const director = mount();
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided");
assert.equal(director.wheel(), true);
for (let i = 0; i < 60; i++) director.frame();
assert.equal(director.context.scrollY, 100);
assert(director.views.at(-1).holding);
assert.equal(director.announcements.filter((event) => event.type === "expedition:stop").length, 1, "A stop event is emitted on arrival, not each progress frame");
assert.equal(director.announcements.find((event) => event.type === "expedition:stop").detail.id, "stop-0");
director.resizeHeight(650);
director.frame();
assert(director.views.at(-1).holding, "Mobile toolbar resizing must not release a reading pause");
director.growStory();
director.frame();
assert(director.views.at(-1).holding, "A stop opening its own disclosure must preserve its dwell");
assert.equal(director.announcements.filter((event) => event.type === "expedition:stop").length, 1, "Geometry refresh must not reannounce the same arrival");
assert.equal(director.wheel({ ctrlKey: true }), false, "Pinch/zoom wheels remain native");
assert.equal(director.frames.size, 0, "Native gestures cancel director inertia");
assert.equal(director.wheel({ target: director.nested }), false, "Nested scrolling remains native, including its boundaries");
assert.equal(director.wheel({ target: director.field }), false, "Form controls keep native input");
assert.equal(director.wheel({ deltaX: 900, deltaY: 10 }), false, "Horizontal gestures remain native");
assert.equal(director.key("ArrowRight", director.crystal), false, "Crystal keyboard rotation must not be intercepted");
director.modal(true);
assert.equal(director.wheel(), false, "Dialogs own their scrolling");
assert.equal(director.key("Escape"), false, "Modal Escape remains available for native dialog dismissal");
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided", "Closing a dialog must not turn off guided pacing");
director.modal(false);
director.body.style.overflow = "hidden";
director.key("Escape");
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided", "A body-locked overlay owns Escape even without a native dialog");
director.body.style.overflow = "";
director.key("Escape", director.content, { defaultPrevented: true });
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided", "Previously handled Escape must preserve pacing mode");
const disclosureEscape = (event) => { if (event.key === "Escape") event.preventDefault(); };
director.document.addEventListener("keydown", disclosureEscape);
assert.equal(director.key("Escape"), true);
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided", "A later-mounted document disclosure handler must get Escape before the global director");
director.document.removeEventListener("keydown", disclosureEscape);
director.wheel(); director.frame();
director.nativeScroll(820);
assert.equal(director.frames.size, 0, "Scrollbar/direct native navigation must not be pulled back to a gate");
director.wheel({ deltaY: -500 }); director.frame();
director.document.fire("click", { target: director.anchor });
assert.equal(director.frames.size, 0, "Anchor activation must cancel director movement before native navigation");
assert.equal(director.key("Escape"), false, "Escape exits guidance without swallowing native Escape behavior");
assert.equal(director.root.getAttribute("data-expedition-mode"), "free");
assert.equal(director.wheel(), false);
assert.equal(director.key("PageDown"), false, "Free mode keeps native keyboard scrolling");
director.controls().toggle();
assert.equal(director.root.getAttribute("data-expedition-mode"), "guided");
director.controls().skip();
assert.equal(director.calls.at(-1).behavior, "smooth");
director.unmount();

for (const options of [{ reduced: true }, { storedMode: "free" }]) {
  const native = mount(options);
  assert.equal(native.root.getAttribute("data-expedition-mode"), "free");
  assert.equal(native.wheel(), false);
  native.unmount();
}
const interruption = mount();
interruption.wheel(); interruption.frame();
interruption.window.fire("beforeprint");
assert.equal(interruption.frames.size, 0);
assert.equal(interruption.wheel(), false, "Printing must leave input native");
interruption.window.fire("afterprint"); interruption.frame();
interruption.wheel(); interruption.frame();
interruption.document.hidden = true; interruption.document.fire("visibilitychange");
assert.equal(interruption.frames.size, 0, "Hidden documents must retain no pacing animation loop");
interruption.unmount();

const phone = mount();
const finger = (x, y, id = 1) => ({ identifier: id, clientX: x, clientY: y });
const start = (touches, target = phone.content) => phone.window.fire("touchstart", { target, touches });
const move = (touches) => {
  let prevented = false;
  phone.window.fire("touchmove", { touches, cancelable: true, preventDefault() { prevented = true; } });
  return prevented;
};
start([finger(30, 300)]);
assert.equal(move([finger(30, 100)]), true, "A vertical guided swipe must enter the pacing controller");
for (let i = 0; i < 60; i++) phone.frame();
assert.equal(phone.context.scrollY, 100, "Fast touch travel must also stop at the next beat");
assert.equal(move([finger(30, 100), finger(100, 200, 2)]), false, "A second finger immediately hands pinch gestures back to the browser");
assert.equal(phone.frames.size, 0);
start([finger(30, 300)], phone.crystal);
assert.equal(move([finger(150, 305)]), false, "Horizontal crystal drags stay native");
assert.equal(phone.frames.size, 0);
start([finger(30, 300)], phone.nested);
assert.equal(move([finger(30, 100)]), false, "Touch scroll inside a nested panel stays native");
start([finger(30, 300)]);
assert.equal(move([finger(30, 200)]), true);
phone.window.fire("touchcancel");
assert.equal(phone.frames.size, 0, "Canceled touches must leave no momentum behind");
phone.unmount();

const preserved = mount({ projectMode: true });
preserved.nativeScroll(500);
const changeLayout = (event) => { preserved.shiftLayout(event.detail.mode === "free" ? -300 : 0); preserved.window.fire("expedition:refresh"); };
preserved.window.addEventListener("expedition:modechange", changeLayout);
preserved.controls().toggle();
preserved.frame(); preserved.frame();
assert.equal(preserved.context.scrollY, 400, "Collapsing guided runways must preserve the current narrative beat at its reading offset");
preserved.controls().toggle();
preserved.frame(); preserved.frame();
assert.equal(preserved.context.scrollY, 500, "Returning to guided mode must restore the same beat's marker");
preserved.controls().toggle();
assert.equal(preserved.wheel(), false, "New input cancels delayed mode restoration and stays native");
const afterInput = preserved.context.scrollY;
preserved.frame(); preserved.frame();
assert.equal(preserved.context.scrollY, afterInput, "Mode restoration must not pull the reader back after new input");
preserved.window.removeEventListener("expedition:modechange", changeLayout);
preserved.unmount();

const rounding = mount({ projectMode: true, readingTop: 300, integerScroll: true });
rounding.nativeScroll(500);
const roundLayout = (event) => rounding.shiftLayout(event.detail.mode === "free" ? -299.6 : 0);
rounding.window.addEventListener("expedition:modechange", roundLayout);
rounding.controls().toggle(); rounding.frame(); rounding.frame();
assert.equal(rounding.context.scrollY, 360);
rounding.controls().toggle(); rounding.frame(); rounding.frame();
assert.equal(rounding.context.scrollY, 500, "Fractional text geometry at the reading line must retain the same beat after integer scroll rounding");
rounding.window.removeEventListener("expedition:modechange", roundLayout);
rounding.unmount();

const mineral = mount({ skillMode: true });
mineral.nativeScroll(500);
const mineralLayout = (event) => {
  mineral.shiftLayout(event.detail.mode === "free" ? -300 : 0);
  mineral.markers.forEach((node) => { node.dataset.stopOffset = event.detail.mode === "free" ? "80" : "0"; });
};
mineral.window.addEventListener("expedition:modechange", mineralLayout);
mineral.controls().toggle(); mineral.frame(); mineral.frame();
assert.equal(mineral.context.scrollY, 120, "Free skill mode must preserve the canonical article below navigation after runways collapse");
mineral.controls().toggle(); mineral.frame(); mineral.frame();
assert.equal(mineral.context.scrollY, 500, "Guided skill mode must read the article's newly measured zero offset");
mineral.window.removeEventListener("expedition:modechange", mineralLayout);
mineral.unmount();

const fragment = mount();
fragment.nativeScroll(297);
assert.equal(fragment.views.at(-1).label, "Beat 0");
fragment.nativeScroll(299);
fragment.nativeScroll(300);
assert.equal(fragment.views.at(-1).label, "Beat 1", "Small final native smooth-scroll steps must update the director label at the destination");
assert.equal(fragment.frames.size, 0, "Synchronizing native position must not create a camera loop");
fragment.unmount();

console.log("PASS: bounded scene gates, full arrival dwell, reverse escape, no queued tour, grouped skip, 60/120Hz travel, wheel/touch/pinch/native control/navigation bypass, event contract, semantic mode preservation including fractional geometry, reduced motion, toolbar/disclosure resize, print/hidden cleanup.");
