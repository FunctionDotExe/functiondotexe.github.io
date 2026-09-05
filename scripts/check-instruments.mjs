import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function events() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener: (name, callback) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
    removeEventListener: (name, callback) => { listeners.get(name)?.delete(callback); if (!listeners.get(name)?.size) listeners.delete(name); },
    fire: (name, data = {}) => [...(listeners.get(name) ?? [])].forEach((callback) => callback(data)),
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
  document.querySelector = (selector) => selector.startsWith("#") ? sections.get(selector.slice(1)) : {};
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
    exports: {}, document, scrollY: 0, innerHeight: 900, innerWidth: 640, ...browser,
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
      if (module === "lucide-react") return new Proxy({}, { get: (_target, key) => String(key) });
      if (module === "@/lib/summit-content") return { SUMMIT_CONTENT: { identity: { email: "rubenbmaxwell@gmail.com", location: "Toronto, Canada" } } };
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
    open: () => { find((node) => node.props.className === "route-instrument" || node.props.className?.includes("journey-nav__menu-button")).props.onClick(); render(); },
    navigate: (id, event = {}) => {
      find((node) => node.props.href === `#${id}` && typeof node.props.onClick === "function").props.onClick({ button: 0, ...event });
      if (dirty) render();
    },
    current: () => find((node) => node.props.className === "route-instrument").props["aria-label"],
    active: (id) => find((node) => node.props.href === `#${id}`)?.props["aria-current"],
    backdrop: () => { find((node) => node.type === "dialog").props.onClick({ target: dialog, currentTarget: dialog }); if (dirty) render(); },
    viewport: (width) => { context.innerWidth = width; browser.fire("resize"); if (dirty) render(); },
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

const navigation = harness("SummitNav");
navigation.open();
navigation.navigate("crust", { metaKey: true });
assert.equal(navigation.dialog.open, true);
navigation.navigate("crust");
navigation.frame();
assert.equal(navigation.document.activeElement, navigation.section("crust"), "Mobile Skills navigation must focus the skills section");
navigation.scroll(1700);
navigation.frame();
assert.equal(navigation.active("crust"), "location", "Skills must be represented in the active main navigation");
navigation.open();
navigation.backdrop();
assert.equal(navigation.dialog.open, false, "The mobile menu must dismiss on a backdrop click like the other dialogs");
navigation.open();
navigation.viewport(1100);
assert.equal(navigation.dialog.open, false, "Desktop resizing must close the mobile menu and release scroll lock");
navigation.frame();
navigation.unmount();
assert.equal(navigation.document.body.style.overflow, "auto");

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

function contactHarness() {
  let status = "idle", cleanup, serial = 0;
  const timers = new Map();
  const requests = [];
  const context = {
    exports: {},
    navigator: { clipboard: { writeText: (text) => new Promise((resolve, reject) => requests.push({ text, resolve, reject })) } },
    setTimeout: (callback) => { timers.set(++serial, callback); return serial; },
    clearTimeout: (id) => timers.delete(id),
    require: (module) => {
      if (module === "react") return {
        useRef: (value) => ({ current: value }),
        useState: (initial) => [initial, (value) => { status = value; }],
        useEffect: (effect) => { cleanup = effect(); },
      };
      if (module === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (module === "lucide-react") return new Proxy({}, { get: (_target, key) => String(key) });
      if (module === "@/lib/summit-content") return { SUMMIT_CONTENT: { identity: { email: "rubenbmaxwell@gmail.com" } } };
      throw new Error(module);
    },
  };
  const source = ts.transpileModule(readFileSync(new URL("../components/summit/ContactActions.tsx", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, context);
  const tree = context.exports.ContactActions();
  return {
    copy: tree.props.children.find((node) => node.type === "button").props.onClick,
    requests,
    status: () => status,
    expire: () => { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach((callback) => callback()); },
    pending: () => timers.size,
    unmount: () => { cleanup(); assert.equal(timers.size, 0); },
  };
}

const contact = contactHarness();
const olderCopy = contact.copy();
const newerCopy = contact.copy();
assert.equal(contact.requests[1].text, "rubenbmaxwell@gmail.com", "Copy must use the displayed contact address");
contact.requests[1].resolve();
await newerCopy;
assert.equal(contact.status(), "copied");
contact.requests[0].reject(new Error("Older permission request denied"));
await olderCopy;
assert.equal(contact.status(), "copied", "A stale clipboard failure must not replace newer success feedback");
contact.expire();
assert.equal(contact.status(), "idle", "Success feedback must return to the idle control");
const deniedCopy = contact.copy();
contact.requests[2].reject(new Error("Clipboard unavailable"));
await deniedCopy;
assert.equal(contact.status(), "failed", "Clipboard errors must show the existing accessible fallback message");
const lateCopy = contact.copy();
contact.unmount();
contact.requests[3].resolve();
await lateCopy;
assert.equal(contact.pending(), 0, "A clipboard result after unmount must not create a new feedback timer");
assert.equal(contact.status(), "failed", "A clipboard result after unmount must not update detached content");

console.log("PASS: route/mobile navigation, focus, resize, scroll lock, pointer capabilities, bounded tilt, reduced motion, clipboard races/fallback, and cleanup.");
