import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function events() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
    fire: (name, data = {}) => listeners.get(name)?.(data),
  };
}

function harness(name) {
  const hooks = [];
  const frames = new Map();
  const browser = events();
  const preference = { ...events(), matches: false };
  const pointer = { ...events(), matches: true };
  const properties = new Map();
  const document = { body: { style: { overflow: "auto" } }, activeElement: null };
  let serial = 0, hookIndex = 0, dirty = false;
  let tree, queuedEffects, resizeObserver;
  const trigger = { focus: () => { document.activeElement = trigger; } };
  const artifact = {
    ...events(), width: 400, height: 300,
    style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) },
    getBoundingClientRect: () => ({ left: 100, top: 100, width: artifact.width, height: artifact.height }),
  };
  const dialog = {
    open: false,
    showModal: () => { dialog.open = true; document.activeElement = dialog; },
    close: () => { dialog.open = false; trigger.focus(); find((node) => node.type === "dialog").props.onClose(); },
  };
  const sections = new Map(["entry", "work", "crust", "experience", "about", "contact"].map((id, index) => [id, {
    top: index * 1000,
    getBoundingClientRect() { return { top: this.top - context.scrollY }; },
    focus() { document.activeElement = this; },
  }]));
  document.getElementById = (id) => sections.get(id);
  document.querySelector = () => ({});
  const jsx = (type, props) => {
    if (props?.ref) props.ref.current = type === "dialog" ? dialog : type === "button" ? trigger : artifact;
    return { type, props: props ?? {} };
  };
  const react = {
    useRef: (value) => hooks[hookIndex++] ??= { current: value },
    useState: (initial) => {
      const state = hooks[hookIndex++] ??= { value: initial };
      return [state.value, (value) => {
        const next = typeof value === "function" ? value(state.value) : value;
        if (!Object.is(next, state.value)) { state.value = next; dirty = true; }
      }];
    },
    useEffect: (effect, deps) => {
      const slot = hooks[hookIndex++] ??= {};
      if (!slot.deps || deps.some((value, index) => !Object.is(value, slot.deps[index]))) queuedEffects.push(() => {
        slot.cleanup?.(); slot.deps = deps; slot.cleanup = effect();
      });
    },
  };
  const context = {
    exports: {}, document, scrollY: 0, innerHeight: 900, ...browser,
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
    matchMedia: (query) => query.includes("reduced-motion") ? preference : pointer,
    ResizeObserver: class {
      constructor(callback) { resizeObserver = { callback, connected: true }; }
      observe() {}
      disconnect() { resizeObserver.connected = false; }
    },
    require: (module) => {
      if (module === "react") return react;
      if (module === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (module === "lucide-react") return { ArrowDownRight: "icon", Compass: "icon", X: "icon" };
      throw new Error(module);
    },
  };
  context.window = context;
  const source = ts.transpileModule(readFileSync(new URL(`../components/summit/${name}.tsx`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, context);
  const render = () => {
    do {
      dirty = false; hookIndex = 0; queuedEffects = [];
      tree = context.exports[name]({ children: null, kind: "phones" });
      queuedEffects.forEach((effect) => effect());
    } while (dirty);
  };
  const walk = (node, predicate) => {
    if (!node || typeof node !== "object") return null;
    if (predicate(node)) return node;
    const children = node.props?.children;
    return [children].flat(Infinity).map((child) => walk(child, predicate)).find(Boolean) ?? null;
  };
  const find = (predicate) => walk(tree, predicate);
  render();
  return {
    document, artifact, dialog, properties,
    frame: () => { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); if (dirty) render(); },
    pending: () => frames.size,
    open: () => { find((node) => node.props.className === "route-instrument").props.onClick(); render(); },
    navigate: (id, event = {}) => {
      find((node) => node.props.href === `#${id}`).props.onClick({ button: 0, ...event });
      if (dirty) render();
    },
    current: () => find((node) => node.props.className === "route-instrument").props["aria-label"],
    scroll: (y) => { context.scrollY = y; browser.fire("scroll"); },
    resize: (id, top) => { sections.get(id).top = top; resizeObserver.callback(); },
    section: (id) => sections.get(id),
    move: (pointerType = "mouse", clientX = 500, clientY = 400) => artifact.fire("pointermove", { pointerType, clientX, clientY }),
    reduce: () => { preference.matches = true; preference.fire("change"); },
    coarse: () => { pointer.matches = false; pointer.fire("change"); },
    unmount: () => {
      hooks.forEach((slot) => slot.cleanup?.());
      assert.equal(frames.size, 0, "Unmount must cancel every animation and focus callback");
      assert.equal(browser.listeners.size, 0, "Unmount must remove global listeners");
      assert.equal(preference.listeners.size, 0);
      assert.equal(pointer.listeners.size, 0);
      assert.equal(artifact.listeners.size, 0);
      if (resizeObserver) assert.equal(resizeObserver.connected, false);
    },
  };
}

const route = harness("JourneyInstruments");
route.open();
assert.equal(route.document.body.style.overflow, "hidden", "Opening the route must lock background scrolling");
route.navigate("crust", { ctrlKey: true });
assert.equal(route.dialog.open, true, "Modified chapter clicks must preserve the existing modal and new-tab behavior");
route.navigate("crust");
assert.equal(route.dialog.open, false);
assert.equal(route.document.body.style.overflow, "auto", "Navigation must restore the previous body overflow");
route.frame();
assert.equal(route.document.activeElement, route.section("crust"), "Chapter navigation must focus its destination after closing");
route.scroll(1700);
route.frame();
assert(route.current().includes("The foundations"));
route.resize("crust", 2600);
route.frame();
assert(route.current().includes("The work"), "Content resizing must invalidate cached chapter positions");
route.open();
route.navigate("contact");
assert(route.pending() > 0);
route.unmount();
assert.equal(route.document.body.style.overflow, "auto");

const touch = harness("ArtifactMotion");
touch.move("touch");
touch.frame();
assert.equal(touch.properties.size, 0, "Touch interaction on hybrid devices must not tilt decorative objects");
touch.move();
touch.frame();
assert.equal(touch.properties.get("--artifact-x"), "4.50deg");
touch.coarse();
touch.frame();
assert.equal(touch.properties.get("--artifact-x"), "0.00deg", "Losing fine-pointer capability must reset a tilted object");
touch.unmount();
assert.equal(touch.properties.size, 0, "Effect cleanup must remove the inline properties it owns");

const motion = harness("ArtifactMotion");
motion.move("mouse", 900, -200);
motion.frame();
assert.equal(motion.properties.get("--artifact-x"), "4.50deg", "Overflowing artwork must not exceed the tilt limit");
motion.artifact.fire("pointercancel");
motion.frame();
assert.equal(motion.properties.get("--artifact-x"), "0.00deg");
motion.artifact.width = 0;
motion.move();
motion.frame();
assert(![...motion.properties.values()].some((value) => /NaN|Infinity/.test(value)), "Hidden zero-sized objects must not write invalid styles");
motion.artifact.width = 400;
motion.move();
motion.reduce();
motion.frame();
assert.equal(motion.properties.get("--artifact-x"), "0.00deg", "Reduced motion must settle immediately at rest");
motion.unmount();

console.log("PASS: route focus, modified links, resize tracking, scroll lock, touch/pointer capability, tilt bounds, cancellation, reduced motion, and cleanup.");
