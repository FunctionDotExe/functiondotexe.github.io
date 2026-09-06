import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const data = { exports: {} };
vm.runInNewContext(compile("../lib/project-story.ts"), data);
const { PROJECT_STORIES, projectBeatAt } = data.exports;
const stops = [1200, 1800, 2400];
for (let index = 0; index < 3; index++) assert.equal(projectBeatAt(stops[index], stops), index);
assert.equal(projectBeatAt(1797.9, stops), 0);
assert.equal(projectBeatAt(1798, stops), 1, "Subpixel fragment rounding must not leave the previous shot selected");
assert.equal(projectBeatAt(-100, stops), 0);
assert.equal(projectBeatAt(10000, stops), 2);
assert.equal(projectBeatAt(NaN, stops), 0);
assert.equal(projectBeatAt(0, []), 0);

const source = compile("../components/summit/ProjectTheatre.tsx");
const events = () => {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, callback, options) { if (name === "scroll") assert.equal(options.passive, true); if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); if (!listeners.get(name)?.size) listeners.delete(name); },
    fire(name, event = {}) { [...(listeners.get(name) ?? [])].forEach((callback) => callback(event)); },
  };
};
function mount({ mode = "guided", reduced = false, width = 1440, height = 900, visual = "phones" } = {}) {
  let cleanup, reads = 0, shift = 0, serial = 0;
  const frames = new Map(), observers = [], states = [0, false], effects = [];
  const announced = [];
  const window = { ...events(), dispatchEvent(event) { announced.push(event.type); this.fire(event.type, event); } };
  const media = [reduced, true].map((matches) => ({ ...events(), matches, query: "" }));
  const dimensionMatch = (query) => query.split(",").some((branch) => [...branch.matchAll(/\((min|max)-(width|height):\s*(\d+)px\)/g)].every(([, bound, dimension, value]) => bound === "min" ? (dimension === "width" ? context.innerWidth : context.innerHeight) >= Number(value) : (dimension === "width" ? context.innerWidth : context.innerHeight) <= Number(value)));
  const makeStyle = () => ({ properties: new Map(), setProperty(name, value) { this.properties.set(name, value); }, removeProperty(name) { this.properties.delete(name); } });
  const styles = new Map();
  const story = {};
  const shotOffsets = [240, 630, 1130];
  const shots = [0, 1, 2].map((index) => ({
    attrs: new Map(index ? [["aria-hidden", "true"]] : []),
    getBoundingClientRect() { reads++; return { top: 1200 + shotOffsets[index] + shift - context.scrollY }; },
    getAttribute(name) { return this.attrs.get(name) ?? null; },
    setAttribute(name, value) { this.attrs.set(name, value); },
    removeAttribute(name) { this.attrs.delete(name); },
  }));
  const markers = stops.map((y) => ({ style: makeStyle(), dataset: { stopOffset: "0" }, getBoundingClientRect() { reads++; return { top: (this.style.properties.has("top") ? 1200 + Number.parseFloat(this.style.properties.get("top")) : y) + shift - context.scrollY }; } }));
  const element = {
    dataset: {}, style: { setProperty: (name, value) => styles.set(name, value), removeProperty: (name) => styles.delete(name) },
    querySelectorAll: (selector) => selector === ".project-chapter__stop" ? markers : shots,
    getBoundingClientRect() { reads++; return { top: 1200 + shift - context.scrollY }; },
    closest: () => story,
  };
  const document = { ...events(), documentElement: { dataset: { expeditionMode: mode } }, hidden: false, querySelector: () => story };
  class Observer {
    constructor(callback, kind) { this.callback = callback; this.kind = kind; this.nodes = []; observers.push(this); }
    observe(node) { this.nodes.push(node); }
    disconnect() { this.disconnected = true; }
  }
  const props = { project: { visual, title: `Project ${visual}`, altitude: "900m", stage: "Scene", kicker: "Project", tags: ["Code"], image: { src: "/image.webp", width: 400, height: 300, alt: "Project screenshot" }, gallery: [0, 1].map(() => ({ src: "/gallery.webp", width: 300, height: 400, alt: "Project screen" })) }, index: 0 };
  let hook = 0, mounted = false;
  const context = {
    exports: {}, window, document, scrollY: 0, innerHeight: height, innerWidth: width,
    Event: class { constructor(type) { this.type = type; } },
    getComputedStyle: () => ({ scrollPaddingTop: "96px" }),
    matchMedia: (query) => { const item = media[query.includes("reduced-motion") ? 0 : 1]; item.query = query; if (!query.includes("reduced-motion")) item.matches = dimensionMatch(query); return item; },
    addEventListener: window.addEventListener.bind(window), removeEventListener: window.removeEventListener.bind(window),
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; }, cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class extends Observer { constructor(callback) { super(callback, "resize"); } },
    IntersectionObserver: class extends Observer { constructor(callback) { super(callback, "intersection"); } },
    MutationObserver: class extends Observer { constructor(callback) { super(callback, "mutation"); } },
    require(name) {
      if (name === "@/lib/project-story") return data.exports;
      if (name === "@/lib/constants") return { RESUME: { youtubeUrl: "https://youtube.com/example" } };
      if (name === "lucide-react") return { ArrowDown() {}, ArrowRight() {}, Play() {} };
      if (name === "./ProjectViewer") return { ProjectViewer: "viewer", ProjectImageButton: "image-button", ProjectInspectButton: "inspect-button" };
      if (name === "./ArtifactMotion") return { ArtifactMotion: "artifact" };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      assert.equal(name, "react");
      return {
        useRef: () => ({ current: element }),
        useState: (initial) => { const index = hook++; if (!(index in states)) states[index] = initial; return [states[index], (value) => { states[index] = value; }]; },
        useEffect: (effect) => { if (!mounted) effects.push(effect); },
      };
    },
  };
  vm.runInNewContext(source, context);
  const render = () => { hook = 0; return context.exports.ProjectTheatre(props); };
  const initialMarkup = render(); mounted = true;
  effects.forEach((effect) => { cleanup = effect(); });
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); };
  const observer = (kind) => observers.find((item) => item.kind === kind);
  return {
    initialMarkup, render, element, frames, states, shots, markers, styles, announced, flush,
    reads: () => reads,
    scroll(y) { context.scrollY = y; window.fire("scroll"); },
    intersect(visible) { observer("intersection").callback([{ isIntersecting: visible }]); },
    shiftContent(offset) { shift = offset; const resize = observer("resize"); assert(resize.nodes.includes(story), "Upstream story reflow must be observed, not only this fixed-height article"); resize.callback([{ target: story }]); },
    refresh() { window.fire("expedition:refresh"); },
    resize(width, height) { context.innerWidth = width; context.innerHeight = height; media[1].matches = dimensionMatch(media[1].query); media[1].fire("change"); window.fire("resize"); },
    reflowShot(index, offset) { shotOffsets[index] = offset; observer("resize").callback([{ target: element }]); },
    mode(value) { document.documentElement.dataset.expeditionMode = value; observer("mutation").callback(); },
    media(index, value) { media[index].matches = value; media[index].fire("change"); },
    hidden(value) { document.hidden = value; document.fire("visibilitychange"); },
    print() { window.fire("beforeprint"); }, afterPrint() { window.fire("afterprint"); },
    unmount() { cleanup(); assert.equal(frames.size + window.listeners.size + document.listeners.size + media.reduce((sum, item) => sum + item.listeners.size, 0), 0); assert(observers.every((item) => item.disconnected)); assert.equal(styles.size, 0); assert.equal(element.dataset.theatre, undefined); assert(markers.every((marker) => marker.style.properties.size === 0 && marker.dataset.stopOffset === "0")); },
  };
}
function descendants(node, predicate) {
  if (Array.isArray(node)) return node.flatMap((child) => descendants(child, predicate));
  if (!node || typeof node !== "object") return [];
  return [...(predicate(node) ? [node] : []), ...descendants(node.props?.children, predicate)];
}
for (const visual of Object.keys(PROJECT_STORIES)) {
  const theatre = mount({ visual });
  const markup = theatre.initialMarkup;
  const shots = descendants(markup, (node) => node.props.className === "project-shot");
  assert.equal(shots.length, 3);
  assert(shots.every((shot) => !shot.props["aria-hidden"]), "All three authored beats must be accessible before enhancement");
  const markers = descendants(markup, (node) => node.props["data-expedition-stop"]);
  assert.equal(new Set(markers.map((marker) => marker.props.id)).size, 3);
  assert(markers.every((marker) => marker.props["data-stop-scene"] === `project-${visual}` && marker.props["data-stop-offset"] === "0"));
  const links = descendants(markup, (node) => node.type === "nav")[0].props.children;
  links.forEach((link, index) => assert.equal(link.props.href, `#${markers[index].props.id}`));
  assert.equal(descendants(markup, (node) => node.type === "image-button").length, 1);
  assert.equal(descendants(markup, (node) => node.type === "inspect-button").length, 1);
  theatre.unmount();
}

const theatre = mount(); theatre.flush();
assert.equal(theatre.element.dataset.theatre, "cinematic");
const firstReads = theatre.reads();
theatre.scroll(1500); theatre.scroll(1900);
assert.equal(theatre.frames.size, 1, "Multiple scroll events share one frame");
theatre.flush(); assert.equal(theatre.states[0], 1);
assert.equal(theatre.reads(), firstReads, "Ordinary scrolling must not remeasure DOM geometry");
assert.equal(theatre.frames.size, 0, "No idle render loop remains");
theatre.scroll(2450); theatre.flush(); assert.equal(theatre.states[0], 2);
theatre.scroll(1250); theatre.flush(); assert.equal(theatre.states[0], 0, "Reverse scroll retraces the actual physical story stops");
theatre.scroll(1900); theatre.flush();
theatre.shiftContent(400); theatre.flush();
assert.equal(theatre.states[0], 0, "Earlier content expansion must update which physical beat is in view");
theatre.refresh(); theatre.flush();
theatre.scroll(2000); theatre.intersect(false);
assert.equal(theatre.frames.size, 0, "Leaving the prefetch region cancels pending visual work");
theatre.scroll(2200); assert.equal(theatre.frames.size, 0, "Offscreen stages do not schedule scroll frames");
theatre.intersect(true); theatre.flush(); assert.equal(theatre.states[0], 1);
theatre.hidden(true); theatre.scroll(3000); assert.equal(theatre.frames.size, 0);
theatre.hidden(false); theatre.flush(); assert.equal(theatre.states[0], 2);
theatre.print(); theatre.print();
assert(theatre.shots.every((shot) => shot.getAttribute("aria-hidden") !== "true"), "Print must synchronously expose every narrative to accessible PDF export");
theatre.scroll(1200); assert.equal(theatre.frames.size, 0, "Print must suspend cinematic updates");
theatre.afterPrint(); theatre.flush();
assert.equal(theatre.shots[1].getAttribute("aria-hidden"), "true", "Print restores prior accessibility state");
theatre.mode("free"); theatre.flush(); assert.equal(theatre.element.dataset.theatre, "reading");
assert(descendants(theatre.render(), (node) => node.props.className === "project-shot").every((shot) => !shot.props["aria-hidden"]));
theatre.mode("guided"); theatre.flush(); theatre.media(0, true); theatre.flush();
assert.equal(theatre.element.dataset.theatre, "reading");
theatre.media(0, false); theatre.media(1, false); theatre.flush();
assert.equal(theatre.element.dataset.theatre, "reading", "Short viewports retain complete normal-flow narrative");
theatre.unmount();
const offscreenPrint = mount();
offscreenPrint.intersect(false);
offscreenPrint.print(); offscreenPrint.afterPrint();
assert.equal(offscreenPrint.shots[0].getAttribute("aria-hidden"), null, "Printing before an offscreen stage's first frame must preserve its initially active accessible narrative");
offscreenPrint.unmount();

const reading = mount({ width: 390, height: 780 });
reading.intersect(false); reading.flush();
assert.equal(reading.element.dataset.theatre, "reading", "A shorter phone keeps all narrative in normal flow even while guidance is enabled");
for (const [index, marker] of reading.markers.entries()) {
  assert.equal(Number.parseFloat(marker.style.properties.get("top")), [240, 630, 1130][index], "Reading marker positions must come from unequal paragraph geometry rather than article percentages");
  assert.equal(marker.getBoundingClientRect().top, reading.shots[index].getBoundingClientRect().top, "Native fragment markers address the actual paragraph");
  assert.equal(marker.dataset.stopOffset, "96", "Guided arrival uses the same fixed-navigation offset as native fragment scrolling");
  assert.equal(marker.style.properties.get("scroll-margin-top"), "0px");
}
const readingReads = reading.reads();
reading.scroll(1800); reading.scroll(2400);
assert.equal(reading.frames.size, 0, "Reading and offscreen scrolling must schedule no theatre work");
assert.equal(reading.reads(), readingReads);
const notifications = reading.announced.length;
reading.shiftContent(200); reading.flush();
assert.equal(reading.announced.length, notifications + 1, "Upstream reflow must notify the director after reading targets move");
assert.equal(reading.frames.size, 0, "Geometry notification must not invalidate itself forever");
reading.refresh(); reading.flush();
assert.equal(reading.announced.length, notifications + 1, "Unchanged geometry must not emit another refresh");
reading.reflowShot(1, 790); reading.flush();
assert.equal(reading.markers[1].style.properties.get("top"), "790.000px", "A resized paragraph updates the physical anchor while offscreen");
assert.equal(reading.markers[1].getBoundingClientRect().top, reading.shots[1].getBoundingClientRect().top);
reading.resize(390, 844); reading.flush();
assert.equal(reading.element.dataset.theatre, "cinematic");
assert(reading.markers.every((marker) => marker.dataset.stopOffset === "0" && marker.style.properties.size === 0), "Cinematic mode must restore CSS percentage markers and negative native fragment margins");
reading.mode("free"); reading.flush();
assert.equal(reading.markers[1].style.properties.get("top"), "790.000px");
assert.equal(reading.markers[1].dataset.stopOffset, "96");
reading.scroll(2800); assert.equal(reading.frames.size, 0);
reading.unmount();

for (const [width, height, expected] of [[359, 900, false], [360, 799, false], [360, 800, true], [760, 799, false], [760, 800, true], [761, 739, false], [761, 740, true], [1440, 740, true]]) {
  const viewport = mount({ width, height }); viewport.flush();
  assert.equal(viewport.element.dataset.theatre, expected ? "cinematic" : "reading", `The actual spacious media query must classify ${width}x${height} correctly`);
  viewport.unmount();
}
console.log("PASS: project beat boundaries, complete SSR narratives, gallery and marker contract, exact reading paragraph/fragment targets, cached offscreen geometry, upstream reflow, mobile/desktop viewport boundaries, reversible free/cinematic modes, synchronous accessible printing and cleanup.");
