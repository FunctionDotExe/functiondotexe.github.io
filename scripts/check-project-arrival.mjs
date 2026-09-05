import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/ProjectArrival.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function events() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); if (!listeners.get(name)?.size) listeners.delete(name); },
    fire(name, event = {}) { [...(listeners.get(name) ?? [])].forEach((callback) => callback(event)); },
  };
}

function mount({ reduced = false, observerSupported = true } = {}) {
  let cleanup, notify, serial = 0;
  const timers = new Map();
  const observed = new Set();
  const preference = { ...events(), matches: reduced };
  const artifacts = Array.from({ length: 4 }, () => ({
    ...events(), attributes: new Map(), focused: false,
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
    matches() { return this.focused; },
  }));
  const document = { ...events(), hidden: false, querySelectorAll: () => artifacts };
  const window = events();
  const context = {
    exports: {}, document, window,
    matchMedia: () => preference,
    setTimeout: (callback) => { timers.set(++serial, callback); return serial; },
    clearTimeout: (id) => timers.delete(id),
    require(name) { assert.equal(name, "react"); return { useEffect: (effect) => { cleanup = effect(); } }; },
    IntersectionObserver: observerSupported ? class {
      constructor(callback) { notify = callback; }
      observe(element) { observed.add(element); }
      unobserve(element) { observed.delete(element); }
      disconnect() { observed.clear(); }
    } : undefined,
  };
  vm.runInNewContext(source, context);
  assert.equal(context.exports.ProjectArrival(), null, "Enhancement must not replace or hide server-rendered content");
  return {
    artifacts, timers, observed, preference, document, window,
    enter(index, ratio = .4) { notify?.([{ target: artifacts[index], isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    arriving(index) { return artifacts[index].attributes.has("data-project-arrival"); },
    finish() { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach((callback) => callback()); },
    unmount() {
      cleanup?.();
      assert.equal(timers.size, 0, "Unmount must cancel all remaining animation cleanup timers");
      assert.equal(observed.size, 0, "Unmount must disconnect visibility observation");
      assert.equal(preference.listeners.size + document.listeners.size + window.listeners.size, 0);
      artifacts.forEach((artifact) => {
        assert.equal(artifact.listeners.size, 0);
        assert.equal(artifact.attributes.size, 0, "Unmount must remove transient animation state");
      });
    },
  };
}

const projects = mount();
assert(projects.artifacts.every((artifact) => artifact.attributes.size === 0), "Offscreen content must not be put in a hidden or translated waiting state");
projects.enter(0, .05);
assert.equal(projects.arriving(0), false, "A tiny edge intersection should not consume the project arrival");
projects.enter(0);
assert.equal(projects.arriving(0), true);
assert.equal(projects.timers.size, 1);
assert.equal(projects.observed.has(projects.artifacts[0]), false, "An introduced project should stop receiving observer work");
projects.enter(0);
assert.equal(projects.timers.size, 1, "Repeated observer delivery must not restart an arrival");
projects.finish();
assert.equal(projects.arriving(0), false, "After its finite entrance no transform state should remain");
projects.enter(0);
assert.equal(projects.arriving(0), false, "Revisiting a project must not replay its invitation");
projects.artifacts[1].fire("focusin");
projects.enter(1);
assert.equal(projects.arriving(1), false, "A keyboard-focused project must not start moving under focus");
projects.enter(2);
projects.artifacts[2].fire("click");
assert.equal(projects.arriving(2), false, "Opening a gallery must settle its artifact without intercepting the click");
projects.enter(3);
projects.unmount();
projects.enter(3);
assert.equal(projects.timers.size, 0, "A late observer callback must not restart work after unmount");

const motionPreference = mount();
motionPreference.enter(0);
motionPreference.preference.matches = true;
motionPreference.preference.fire("change");
assert.equal(motionPreference.arriving(0), false, "Enabling reduced motion must immediately stop a running entrance");
assert.equal(motionPreference.timers.size, 0);
motionPreference.enter(1);
assert.equal(motionPreference.arriving(1), false, "Reduced motion must not queue new entrances");
motionPreference.unmount();

const interrupted = mount();
interrupted.enter(0);
interrupted.window.fire("beforeprint");
assert.equal(interrupted.timers.size, 0, "Printing must settle every artifact");
interrupted.enter(1);
assert.equal(interrupted.arriving(1), false, "Print layout changes must not start new entrances");
interrupted.window.fire("afterprint");
interrupted.enter(1);
assert.equal(interrupted.arriving(1), true, "Unseen projects remain eligible after printing");
interrupted.document.hidden = true;
interrupted.document.fire("visibilitychange");
assert.equal(interrupted.timers.size, 0, "A hidden tab must not retain animation cleanup work");
interrupted.enter(2);
assert.equal(interrupted.arriving(2), false);
interrupted.document.hidden = false;
interrupted.enter(2);
assert.equal(interrupted.arriving(2), true, "An unseen project remains eligible when the tab is visible again");
interrupted.unmount();

const fallback = mount({ observerSupported: false });
assert.equal(fallback.timers.size, 0);
assert(fallback.artifacts.every((artifact) => artifact.attributes.size === 0));
fallback.unmount();

console.log("PASS: one-time project arrival, visible baseline, keyboard/click settlement, reduced motion, print/hidden-tab interruption, observer fallback and cleanup.");
