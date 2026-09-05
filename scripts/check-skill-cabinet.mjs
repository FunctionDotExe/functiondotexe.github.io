import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const geometry = { exports: {} };
vm.runInNewContext(compile("../lib/skill-scroll.ts"), geometry);
const { skillScrollProgress } = geometry.exports;
const stops = [100, 440, 920, 1320, 1770, 2250];
for (let index = 0; index < stops.length; index++) {
  assert.equal(skillScrollProgress(stops[index], stops, 2650), index);
  const next = stops[index + 1] ?? 2650;
  assert.equal(skillScrollProgress((stops[index] + next) / 2, stops, 2650), index + .5);
}
assert.equal(skillScrollProgress(-500, stops, 2650), 0);
assert.equal(skillScrollProgress(9000, stops, 2650), 6);
assert.equal(skillScrollProgress(NaN, stops, 2650), 0);
assert.equal(skillScrollProgress(0, [], 0), 0);
assert(Number.isFinite(skillScrollProgress(110, [100, 100], 120)), "Collapsed fields must not divide by zero");

const source = compile("../components/summit/SkillCabinet.tsx");
function mount({ reducedMotion = false, sticky = true } = {}) {
  const listeners = new Map();
  const documentListeners = new Map();
  const mediaListeners = new Map();
  const effects = [];
  const refs = [];
  const frames = new Map();
  const observers = [];
  const selections = [];
  const reveals = [];
  const turns = [];
  const properties = new Map();
  let frameId = 0;
  let reads = 0;
  let offset = 0;
  let stateIndex = 0;
  let opened = 63;
  const skills = Array.from({ length: 6 }, (_, index) => ({ category: `Field ${index}`, description: `Description ${index}`, tools: [`Tool ${index}`] }));
  const window = {
    scrollY: 0,
    matchMedia: () => media,
    addEventListener: (name, callback, options) => { if (name === "scroll") assert.equal(options.passive, true); listeners.set(name, callback); },
    removeEventListener: (name) => listeners.delete(name),
  };
  const document = { documentElement: {}, hidden: false, addEventListener: (name, cb) => documentListeners.set(name, cb), removeEventListener: (name) => documentListeners.delete(name) };
  const media = { matches: reducedMotion, addEventListener: (name, cb) => mediaListeners.set(name, cb), removeEventListener: (name) => mediaListeners.delete(name) };
  const style = { setProperty: (name, value) => properties.set(name, value), removeProperty: (name) => properties.delete(name) };
  const specimen = { offsetHeight: 280 };
  const element = (attributes) => ({
    attributes, dataset: { open: "true" }, inert: false,
    getAttribute(name) { return this.attributes[name] ?? null; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  });
  const panels = skills.map(() => element({ "aria-hidden": "false" }));
  const toggles = skills.map(() => element({ "aria-expanded": "true" }));
  const fields = skills.map((_, index) => ({ offsetHeight: 400, querySelector: (selector) => selector === ".skill-field__panel" ? panels[index] : toggles[index], getBoundingClientRect: () => { reads++; return { top: 1376 + index * 400 + offset - window.scrollY }; } }));
  const root = {
    style, querySelector: (name) => name === ".skill-cabinet__specimen" ? specimen : { style },
    querySelectorAll: () => fields, closest: () => ({}),
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const context = {
    exports: {}, window, document, ResizeObserver: Observer, IntersectionObserver: Observer,
    getComputedStyle: () => ({ top: "72px", position: sticky ? "sticky" : "relative", scrollPaddingTop: "80px" }),
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id),
    require: (name) => {
      if (name === "@/lib/constants") return { SKILLS: skills };
      if (name === "@/lib/skill-scroll") return geometry.exports;
      if (name === "./CrystalScene") return { CrystalScene: () => null };
      if (name === "lucide-react") return { ArrowDown: () => null, ChevronDown: () => null };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      assert.equal(name, "react");
      return {
        useRef: (value) => { const ref = { current: refs.length === 0 ? root : refs.length === 1 ? { setProgress: (value) => turns.push(value) } : value }; refs.push(ref); return ref; },
        useState: (initial) => {
          const slot = stateIndex++;
          return [initial, (value) => {
            if (slot === 0) selections.push(value);
            else {
              opened = value; reveals.push(value);
              panels.forEach((panel, index) => {
                const open = Boolean(value & (1 << index));
                panel.setAttribute("aria-hidden", String(!open)); panel.inert = !open; panel.dataset.open = String(open);
                toggles[index].setAttribute("aria-expanded", String(open));
              });
            }
          }];
        },
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
    markup, frames, selections, turns, fields, panels, toggles, properties, flush, scroll,
    opened: () => opened,
    toggle: (index) => markup.props.children[1].props.children[index].props.children[1].props.children.props.onClick(),
    reads: () => reads,
    resize: () => observers[0].callback(),
    shiftContent: (value) => { offset = value; observers[0].callback(); },
    intersect: (visible) => observers[1].callback([{ isIntersecting: visible }]),
    motion: (value) => { media.matches = value; mediaListeners.get("change")(); },
    hidden: (value) => { document.hidden = value; documentListeners.get("visibilitychange")(); },
    print: () => listeners.get("beforeprint")(),
    afterPrint: () => listeners.get("afterprint")(),
    unmount: () => {
      cleanups.forEach((cleanup) => cleanup());
      assert.equal(listeners.size + documentListeners.size + mediaListeners.size + frames.size, 0);
      assert(observers.every((observer) => observer.disconnected));
      assert.equal(properties.size, 0);
    },
  };
}

const cabinet = mount();
const articles = cabinet.markup.props.children[1].props.children;
assert.equal(articles.length, 6);
for (const [index, article] of articles.entries()) {
  assert.equal(article.type, "article", "Every field must remain in the server HTML");
  assert.equal(article.props.id, `skill-field-${index}`);
  assert.equal(article.props.tabIndex, -1, "Fragment navigation must be able to focus each field");
  assert.equal(article.props["aria-labelledby"], article.props.children[1].props.id);
  const toggle = article.props.children[1].props.children;
  const panel = article.props.children[2];
  assert.equal(toggle.type, "button");
  assert.equal(toggle.props.type, "button");
  assert.equal(toggle.props["aria-expanded"], true, "Without enhancement all skills start readable");
  assert.equal(toggle.props["aria-controls"], panel.props.id);
  assert.equal(panel.props["aria-hidden"], false);
  assert.equal(panel.props.inert, false);
  assert.equal(panel.props.children.props.children[0].props.children, `Description ${index}`);
}
const links = cabinet.markup.props.children[0].props.children[2].props.children[0].props.children;
links.forEach((link, index) => {
  assert.equal(link.props.href, `#${articles[index].props.id}`);
  assert.equal(link.props["aria-label"], `Field ${index}`);
});
cabinet.flush();
assert.equal(cabinet.opened(), 0, "Fields wait to unfold until the reader reaches them");
assert.equal(cabinet.properties.get("--skill-scroll-padding"), "80px", "Anchor offsets must account for the root scroll padding");
const initialReads = cabinet.reads();
cabinet.scroll(1100);
cabinet.scroll(1200);
assert.equal(cabinet.frames.size, 1, "Scroll bursts must coalesce into one frame");
cabinet.flush();
assert.equal(cabinet.turns.at(-1), .5);
assert.equal(cabinet.opened(), 1, "The first panel opens while its first gem turns");
assert.equal(cabinet.reads(), initialReads, "Scroll updates must not measure layout");
assert.equal(cabinet.frames.size, 0, "The cabinet must have no idle animation loop");
for (let index = 0; index < 6; index++) {
  cabinet.scroll(1000 + index * 400 + 100);
  cabinet.flush();
  assert.equal(cabinet.turns.at(-1), index + .25);
  assert.equal(cabinet.opened(), (1 << (index + 1)) - 1, "Each gem stage must open its matching field and retain earlier fields");
}
assert.deepEqual(cabinet.selections, [1, 2, 3, 4, 5], "React updates only at skill boundaries");
cabinet.scroll(1500);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), 1.25, "Reverse scrolling retraces the skill sequence");
assert.equal(cabinet.selections.at(-1), 1);
assert.equal(cabinet.opened(), 63, "Reverse scrolling keeps the fully explored fields readable");
cabinet.toggle(1);
assert.equal(cabinet.opened(), 61);
cabinet.scroll(1550);
cabinet.flush();
assert.equal(cabinet.opened(), 61, "A manual close must not be undone on the next scroll frame");
cabinet.scroll(1950);
cabinet.flush();
cabinet.scroll(1500);
cabinet.flush();
assert.equal(cabinet.opened(), 63, "Returning to a gem opens that skill again");
cabinet.shiftContent(200);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), .75, "Earlier content expansion must invalidate cached chapter positions");
cabinet.intersect(false);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), null);
cabinet.scroll(2300);
assert.equal(cabinet.frames.size, 0, "Offscreen scroll must not schedule work");
cabinet.intersect(true);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), 2.75);
cabinet.motion(true);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), null, "Reduced motion suppresses scroll-driven spin");
assert.equal(cabinet.opened(), 63, "Reduced motion exposes every field without animated reveals");
cabinet.motion(false);
cabinet.flush();
cabinet.hidden(true);
cabinet.scroll(2600);
assert.equal(cabinet.frames.size, 0);
cabinet.hidden(false);
cabinet.flush();
assert.equal(cabinet.turns.at(-1), 3.5);
const beforePrint = cabinet.selections.at(-1);
cabinet.print();
cabinet.scroll(0);
assert.equal(cabinet.frames.size, 0, "Print layout must not change skill selection");
assert.equal(cabinet.selections.at(-1), beforePrint);
cabinet.afterPrint();
cabinet.flush();
cabinet.unmount();

const compact = mount({ reducedMotion: true, sticky: false });
compact.flush();
assert.equal(compact.opened(), 63);
compact.toggle(0);
compact.scroll(1300);
compact.flush();
assert.equal(compact.opened(), 62, "Reduced-motion users must keep control of manual closure");
compact.scroll(1776);
compact.flush();
assert.equal(compact.selections.at(-1), 1, "Static short/reduced-motion layouts still track readable skills");
assert.equal(compact.turns.at(-1), null);
compact.unmount();

const edges = mount();
edges.flush();
edges.scroll(1100); edges.flush();
edges.toggle(0);
edges.scroll(900); edges.flush();
edges.scroll(1100); edges.flush();
assert.equal(edges.opened(), 1, "Returning from before the sequence must reopen the first field");
edges.scroll(3100); edges.flush();
edges.toggle(5);
assert.equal(edges.opened(), 31);
edges.scroll(3500); edges.flush();
edges.scroll(3100); edges.flush();
assert.equal(edges.opened(), 63, "Returning from beyond the sequence must reopen the final field");
edges.unmount();

const printed = mount();
printed.flush();
assert(printed.panels.every((panel) => panel.inert));
printed.print(); printed.print();
assert(printed.panels.every((panel) => !panel.inert && panel.getAttribute("aria-hidden") === "false" && panel.dataset.open === "true"), "Printed fields must be exposed to both visual and accessible PDF output");
assert(printed.toggles.every((toggle) => toggle.getAttribute("aria-expanded") === "true"));
printed.afterPrint();
assert(printed.panels.every((panel) => panel.inert && panel.getAttribute("aria-hidden") === "true" && panel.dataset.open === "false"), "Printing must restore the exact collapsed state");
printed.print();
printed.unmount();
assert(printed.panels.every((panel) => panel.inert), "Unmount during print must restore panel accessibility state");
console.log("Skill sequence checks passed: automatic sequential opening with gem turns, retained fields, manual close/re-entry, complete server content, named controls/links, forward/reverse boundaries, cached layout, passive scrolling, offscreen suspension, reduced motion, printing and cleanup.");
