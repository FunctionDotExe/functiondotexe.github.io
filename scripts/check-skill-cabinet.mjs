import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const data = { exports: {} };
vm.runInNewContext(compile("../lib/constants.ts"), data);
const skills = data.exports.SKILLS;
const geometry = { exports: {} };
vm.runInNewContext(compile("../lib/skill-scroll.ts"), geometry);
const { skillScrollProgress } = geometry.exports;
const stops = [100, 440, 920, 1320, 1770, 2250];
for (let index = 0; index < stops.length; index++) {
  assert.equal(skillScrollProgress(stops[index], stops, 2650), index);
  assert.equal(skillScrollProgress((stops[index] + (stops[index + 1] ?? 2650)) / 2, stops, 2650), index + .5);
}
assert.equal(skillScrollProgress(-500, stops, 2650), 0);
assert.equal(skillScrollProgress(9000, stops, 2650), 6);
assert.equal(skillScrollProgress(NaN, stops, 2650), 0);
assert.equal(skillScrollProgress(0, [], 0), 0);
assert(Number.isFinite(skillScrollProgress(110, [100, 100], 120)));

const source = compile("../components/summit/SkillCabinet.tsx");
function mount({ mode = "guided", reducedMotion = false, roomy = true, compact = false, observerSupport = true } = {}) {
  const listeners = new Map();
  const documentListeners = new Map();
  const effects = [];
  const refs = [];
  const frames = new Map();
  const observers = [];
  const selections = [];
  const turns = [];
  const events = [];
  let frameId = 0;
  let reads = 0;
  let offset = 0;
  const media = [reducedMotion, roomy, compact].map((matches) => ({ matches, listeners: new Map(), addEventListener(name, cb) { this.listeners.set(name, cb); }, removeEventListener(name) { this.listeners.delete(name); } }));
  const makeStyle = () => ({ properties: new Map(), setProperty(name, value) { this.properties.set(name, value); }, removeProperty(name) { this.properties.delete(name); } });
  const scenes = skills.map(() => ({ style: makeStyle(), dataset: {} }));
  const window = {
    scrollY: 0,
    matchMedia: (query) => media[query.includes("reduced-motion") ? 0 : query.includes("min-height") ? 1 : 2],
    addEventListener: (name, callback, options) => { if (name === "scroll") assert.equal(options.passive, true); listeners.set(name, callback); },
    removeEventListener: (name) => listeners.delete(name),
    dispatchEvent: (event) => events.push(event.type),
  };
  const document = { documentElement: { dataset: { expeditionMode: mode } }, hidden: false, addEventListener: (name, cb) => documentListeners.set(name, cb), removeEventListener: (name) => documentListeners.delete(name) };
  const root = {
    dataset: {}, style: makeStyle(), closest: () => ({}),
    querySelectorAll: (selector) => selector === ".mineral-chapter" ? fields : scenes,
  };
  const fieldHeight = () => root.dataset.theatreMode === "guided" ? 844 : 400;
  const fields = skills.map((_, index) => ({
    dataset: { stopOffset: "0" },
    get offsetHeight() { return fieldHeight(); },
    getBoundingClientRect: () => { reads++; return { top: 1200 + index * fieldHeight() + offset - window.scrollY }; },
  }));
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const context = {
    exports: {}, window, document, Event: class { constructor(type) { this.type = type; } },
    getComputedStyle: () => ({ scrollPaddingTop: "96px" }),
    ResizeObserver: observerSupport ? Observer : undefined, IntersectionObserver: observerSupport ? Observer : undefined, MutationObserver: observerSupport ? Observer : undefined,
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id),
    require: (name) => {
      if (name === "@/lib/constants") return { SKILLS: skills };
      if (name === "@/lib/skill-scroll") return geometry.exports;
      if (name === "./CrystalScene") return { CrystalScene: () => null };
      if (name === "lucide-react") return { ArrowDown: () => null };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      assert.equal(name, "react");
      return {
        useRef: (value) => { const ref = { current: refs.length === 0 ? root : refs.length === 1 ? { setProgress: (value) => turns.push(value) } : value }; refs.push(ref); return ref; },
        useState: (initial) => [initial, (value) => selections.push(value)],
        useEffect: (effect) => effects.push(effect),
      };
    },
  };
  vm.runInNewContext(source, context);
  const markup = context.exports.SkillCabinet();
  const cleanups = effects.map((effect) => effect());
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); };
  const scroll = (y) => { window.scrollY = y; listeners.get("scroll")?.(); };
  return {
    markup, root, scenes, frames, selections, turns, events, flush, scroll,
    compute: context.exports.mineralTheatreFrame,
    reads: () => reads,
    resize: () => listeners.get("resize")(),
    shiftContent: (value) => { offset = value; observers[0].callback(); },
    intersect: (visible) => observers[1].callback([{ isIntersecting: visible }]),
    mode: (value) => { document.documentElement.dataset.expeditionMode = value; observers[2].callback(); },
    media: (index, value) => { media[index].matches = value; media[index].listeners.get("change")(); },
    hidden: (value) => { document.hidden = value; documentListeners.get("visibilitychange")(); },
    print: () => listeners.get("beforeprint")(),
    afterPrint: () => listeners.get("afterprint")(),
    unmount: () => {
      cleanups.forEach((cleanup) => cleanup());
      assert.equal(listeners.size + documentListeners.size + media.reduce((sum, query) => sum + query.listeners.size, 0) + frames.size, 0);
      assert(observers.every((observer) => observer.disconnected));
      assert.equal(root.style.properties.size, 0);
      assert.equal(root.dataset.theatreMode, undefined);
      assert(scenes.every((scene) => !scene.style.properties.size && scene.dataset.visible === undefined));
    },
  };
}

// Resolve the actual group component too, so a bad slice cannot silently drop a skill.
function expand(node) {
  if (Array.isArray(node)) return node.flatMap(expand);
  if (!node || typeof node !== "object") return node;
  if (typeof node.type === "function") return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props.children) } };
}
function descendants(node, predicate) {
  if (Array.isArray(node)) return node.flatMap((child) => descendants(child, predicate));
  if (!node || typeof node !== "object") return [];
  return [...(predicate(node) ? [node] : []), ...descendants(node.props.children, predicate)];
}
const cabinet = mount();
const markup = expand(cabinet.markup);
const articles = descendants(markup, (node) => node.type === "article");
assert.equal(articles.length, 6);
for (const [index, article] of articles.entries()) {
  assert.equal(article.props.id, `skill-field-${index}`);
  assert.equal(article.props.tabIndex, -1);
  assert.equal(article.props["data-expedition-stop"], `skill-${index}`);
  assert.equal(article.props["data-stop-scene"], `skill-${index}`);
  assert.equal(article.props["data-stop-duration"], "1800");
  assert.equal(article.props["data-stop-offset"], "0", "Fullscreen beats align the sticky stage at the viewport top");
  assert.equal(article.props["aria-labelledby"], descendants(article, (node) => node.type === "h3")[0].props.id);
  assert.deepEqual(descendants(article, (node) => node.type === "li").map((node) => node.props.children), [...skills[index].tools]);
  assert.equal(descendants(article, (node) => node.props["aria-hidden"] || node.props.inert).length, 1, "Only the decorative stone may be hidden in semantic content");
}
const visual = descendants(markup, (node) => node.props.className === "mineral-theatre__compositions")[0];
assert.equal(visual.props["aria-hidden"], "true", "Visual copies must not duplicate accessible chapter content");
assert.equal(descendants(visual, (node) => ["a", "button", "input"].includes(node.type) || node.props.tabIndex >= 0).length, 0);
const links = descendants(markup, (node) => node.type === "nav")[0].props.children;
links.forEach((link, index) => {
  assert.equal(link.props.href, `#${articles[index].props.id}`);
  assert.equal(link.props["aria-label"], skills[index].category);
});

for (const compact of [false, true]) {
  for (let value = -1; value <= 7; value += .013) {
    const frame = cabinet.compute(value, compact);
    assert(Number.isFinite(frame.x) && Number.isFinite(frame.y));
    assert(frame.active >= 0 && frame.active <= 5);
    assert(frame.scenes.every((scene) => Number.isFinite(scene.x) && scene.opacity >= 0 && scene.opacity <= 1));
    assert(Math.abs(frame.scenes.reduce((sum, scene) => sum + scene.opacity, 0) - 1) < .00001, "Scene transitions must never leave a blank composition");
    assert(Math.abs(frame.x) <= (compact ? 8 : 23));
  }
  for (let index = 0; index < 6; index++) {
    const start = cabinet.compute(index, compact);
    const hold = cabinet.compute(index + .7, compact);
    assert.equal(start.active, index);
    assert.equal(start.scenes[index].opacity, 1);
    assert.equal(start.x, hold.x, "Text and specimen position stay still during the reading portion");
    assert.equal(Math.abs(hold.scenes[index].x), 0);
    if (index < 5) assert.notEqual(cabinet.compute(index + .88, compact).x, start.x, "The specimen must travel between compositions");
  }
  assert.deepEqual(cabinet.compute(NaN, compact), cabinet.compute(0, compact));
}

cabinet.flush();
assert.equal(cabinet.root.dataset.theatreMode, "guided");
assert.equal(cabinet.events.at(-1), "expedition:refresh");
const initialReads = cabinet.reads();
cabinet.scroll(1350); cabinet.scroll(1622);
assert.equal(cabinet.frames.size, 1);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), .5);
assert.equal(cabinet.reads(), initialReads, "Scroll updates use cached layout");
assert.equal(cabinet.frames.size, 0, "Theatre has no idle frame loop");
for (let index = 0; index < 6; index++) {
  cabinet.scroll(1200 + 844 * (index + .25)); cabinet.flush();
  assert.equal(cabinet.turns.at(-1), index + .25);
  assert.equal(cabinet.scenes[index].style.properties.get("--scene-opacity"), "1");
}
assert.deepEqual(cabinet.selections, [1, 2, 3, 4, 5], "React only updates at scene changes");
cabinet.scroll(1200 + 844 * 1.88); cabinet.flush();
const forward = cabinet.root.style.properties.get("--mineral-x");
cabinet.scroll(1200 + 844 * 2.4); cabinet.flush();
cabinet.scroll(1200 + 844 * 1.88); cabinet.flush();
assert.equal(cabinet.root.style.properties.get("--mineral-x"), forward, "Reverse scroll exactly retraces spatial choreography");
cabinet.shiftContent(200); cabinet.flush();
assert(cabinet.reads() > initialReads, "Earlier content expansion invalidates cached markers");
cabinet.intersect(false); cabinet.scroll(4200);
assert.equal(cabinet.frames.size, 0);
assert.equal(cabinet.turns.at(-1), null);
cabinet.intersect(true); cabinet.flush();
assert.notEqual(cabinet.turns.at(-1), null);
cabinet.mode("free"); cabinet.flush();
assert.equal(cabinet.root.dataset.theatreMode, "free");
assert.equal(cabinet.turns.at(-1), null);
cabinet.mode("guided"); cabinet.flush();
cabinet.media(0, true); cabinet.flush();
assert.equal(cabinet.root.dataset.theatreMode, "free", "Runtime reduced motion exposes normal-flow content");
cabinet.media(0, false); cabinet.flush();
cabinet.media(1, false); cabinet.flush();
assert.equal(cabinet.root.dataset.theatreMode, "free", "Short viewports cannot trap text in a clipped stage");
cabinet.media(1, true); cabinet.media(2, true); cabinet.flush();
assert.equal(cabinet.root.dataset.theatreMode, "guided");
assert(Math.abs(parseFloat(cabinet.root.style.properties.get("--mineral-x"))) <= 8);
cabinet.hidden(true); cabinet.scroll(3400);
assert.equal(cabinet.frames.size, 0);
assert.equal(cabinet.turns.at(-1), null);
cabinet.hidden(false); cabinet.flush();
const beforePrint = cabinet.selections.at(-1);
cabinet.print(); cabinet.print(); cabinet.scroll(0);
assert.equal(cabinet.frames.size, 0);
assert.equal(cabinet.selections.at(-1), beforePrint);
cabinet.afterPrint(); cabinet.flush();
cabinet.unmount();
for (const options of [{ reducedMotion: true }, { mode: "free" }, { roomy: false }, { observerSupport: false }]) {
  const fallback = mount(options); fallback.flush();
  assert.equal(fallback.root.dataset.theatreMode, options.observerSupport === false ? "guided" : "free");
  fallback.scroll(1700); fallback.flush(); fallback.resize(); fallback.flush(); fallback.unmount();
}
console.log("Mineral theatre checks passed: complete semantic tool groups, six unique paced stops, accessible native navigation, nonblank held/spatial scenes, forward/reverse motion, cached passive scrolling, boundary-only React state, runtime free/reduced/compact modes, visibility suspension, printing and cleanup.");
