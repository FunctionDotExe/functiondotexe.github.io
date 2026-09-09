import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/portfolio/PortfolioNav.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function harness({ reduced = false } = {}) {
  const slots = [];
  const effects = [];
  const frames = new Map();
  const listeners = new Map();
  const scrolls = [];
  let cursor = 0;
  let serial = 0;
  let tree;
  let focus;
  let targetReads = 0;
  let isMenuOpen = false;
  const target = {
    tabIndex: undefined,
    hasAttribute: () => false,
    getBoundingClientRect: () => ({ top: isMenuOpen ? 1500 : 900 }),
    focus: (options) => { focus = { target: "section", options }; },
  };
  const window = {
    location: { hash: "" }, scrollY: 100,
    matchMedia: () => ({ matches: reduced }),
    scrollTo: (options) => scrolls.push(options),
  };
  const document = {
    getElementById: () => { targetReads++; return target; },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  };
  const jsx = (type, props) => ({ type, props });
  const react = {
    useState: (initial) => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], (value) => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useId: () => "mobile-menu",
    useRef: (initial) => {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
    useEffect: (callback, deps) => {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { deps, cleanup: callback() };
        });
      }
    },
  };
  const context = {
    exports: {}, document, window,
    require: (name) => name === "react" ? react : name === "react/jsx-runtime" ? { jsx, jsxs: jsx } : { Menu: "Menu", X: "X", ArrowUpRight: "ArrowUpRight" },
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  vm.runInNewContext(source, context);
  const find = (node, test) => {
    if (!node || typeof node !== "object") return;
    if (test(node)) return node;
    return [node.props?.children].flat(Infinity).map((child) => find(child, test)).find(Boolean);
  };
  const render = () => {
    cursor = 0;
    tree = context.exports.PortfolioNav();
    isMenuOpen = !!find(tree, (node) => node.props?.className === "p-nav__mobile");
    find(tree, (node) => node.type === "button").props.ref.current = { focus: (options) => { focus = { target: "toggle", options }; } };
    effects.splice(0).forEach((effect) => effect());
  };
  render();
  return {
    window, scrolls,
    get focus() { return focus; },
    get targetReads() { return targetReads; },
    get open() { return isMenuOpen; },
    get controls() { return find(tree, (node) => node.type === "button").props["aria-controls"]; },
    get panelId() { return find(tree, (node) => node.props?.className === "p-nav__mobile")?.props.id; },
    get skipHref() { return find(tree, (node) => node.props?.className === "skip-link")?.props.href; },
    toggle() { find(tree, (node) => node.type === "button").props.onClick(); render(); },
    escape() { listeners.get("keydown")?.({ key: "Escape" }); render(); },
    follow(href, modifiers = {}) {
      const panel = find(tree, (node) => node.props?.className === "p-nav__mobile");
      const link = find(panel, (node) => node.props?.href === href);
      let prevented = false;
      link.props.onClick({ button: 0, currentTarget: { hash: href }, preventDefault() { prevented = true; }, ...modifiers });
      render();
      return prevented;
    },
    frame() { const pending = [...frames.values()]; frames.clear(); pending.forEach((callback) => callback()); },
  };
}

const nav = harness();
assert.equal(nav.skipHref, "#main-content", "Offer keyboard users a direct path to the page content.");
assert.equal(nav.controls, undefined, "A closed menu must not reference an unmounted panel.");
nav.toggle();
assert.equal(nav.open, true);
assert.equal(nav.controls, nav.panelId, "The expanded toggle must identify the mounted panel.");
assert.equal(nav.follow("#contact"), true);
assert.equal(nav.open, false, "The menu must close before measuring the destination.");
assert.equal(nav.targetReads, 0);
nav.frame();
assert.equal(nav.targetReads, 0, "Allow layout to settle before resolving an anchor.");
nav.frame();
assert.equal(nav.window.location.hash, "#contact", "Use native hash navigation so back/forward keep working.");
assert.equal(nav.scrolls[0].top, 908, "Measure the closed layout and clear the fixed header.");
assert.equal(nav.scrolls[0].behavior, "smooth");
assert.equal(nav.focus.target, "section");
assert.equal(nav.focus.options.preventScroll, true);

const reduced = harness({ reduced: true });
reduced.toggle();
reduced.follow("#experience");
reduced.frame();
reduced.frame();
assert.equal(reduced.scrolls[0].behavior, "instant");

const keyboard = harness();
keyboard.toggle();
keyboard.escape();
assert.equal(keyboard.open, false);
assert.equal(keyboard.focus.target, "toggle");
assert.equal(keyboard.scrolls.length, 0);
keyboard.toggle();
assert.equal(keyboard.follow("#work", { ctrlKey: true }), false, "Modified clicks must keep native link behavior.");
assert.equal(keyboard.open, true);

const interrupted = harness();
interrupted.toggle();
interrupted.follow("#contact");
interrupted.toggle();
interrupted.frame();
interrupted.frame();
interrupted.escape();
interrupted.frame();
interrupted.frame();
assert.equal(interrupted.scrolls.length, 0, "Reopening the menu cancels a pending jump.");

console.log("Portfolio navigation checks passed: layout timing, anchors, motion preferences, Escape, modified clicks, and cancellation.");
