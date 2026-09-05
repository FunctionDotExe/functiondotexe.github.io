import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import postcss from "postcss";

const source = ts.transpileModule(readFileSync(new URL("../components/summit/DiscoveryCues.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function mount({ reduce = false, observerAvailable = true } = {}) {
  let cleanup, observer, opensWritten = 0, activated = 0;
  const allNodes = [];
  const events = () => {
    const listeners = new Map();
    return {
      listeners,
      addEventListener: (name, callback) => {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name).add(callback);
      },
      removeEventListener: (name, callback) => { listeners.get(name)?.delete(callback); if (!listeners.get(name)?.size) listeners.delete(name); },
      fire(name, event = {}) {
        [...(listeners.get(name) ?? [])].forEach((callback) => callback({ target: this, preventDefault: () => { throw new Error("Decorative cues must not consume control input"); }, ...event }));
      },
    };
  };
  const element = (name) => {
    const node = {
      ...events(), name, dataset: {}, style: {}, hovered: false, focused: false,
      matches: () => node.hovered || node.focused,
      click: () => { activated++; }, focus: () => { activated++; },
      getBoundingClientRect: () => { throw new Error("Discovery cues must not read layout"); },
    };
    allNodes.push(node);
    return node;
  };
  const disclosure = (name, initialOpen, timeline) => {
    let open = initialOpen;
    const details = element(name);
    const summary = element(`${name}-summary`);
    details.dataset.expanded = String(initialOpen);
    details.querySelector = () => summary;
    details.classList = { contains: (value) => value === "experience-entry" && timeline };
    Object.defineProperty(details, "open", { get: () => open, set: (value) => { opensWritten++; open = value; } });
    return { details, summary };
  };
  const currentRole = disclosure("current-role", true, true);
  const closedRole = disclosure("closed-role", false, true);
  const background = disclosure("background", false, false);
  const email = element("email");
  const copy = element("copy");
  const certificate = element("certificate");
  const portrait = element("portrait");
  portrait.style.transform = "rotate(-5deg)";
  email.dataset.discoveryCue = "original-cue";
  email.dataset.discoveryState = "original-state";
  email.dataset.discoveryPaused = "original-paused";
  const originals = new Map(allNodes.map((node) => [node, { ...node.dataset }]));
  const reduced = { ...events(), matches: reduce };
  const document = {
    ...events(), hidden: false,
    querySelectorAll: (selector) => {
      if (selector === "[data-hover-disclosure]") return [currentRole.details, closedRole.details, background.details];
      if (selector === ".contact-actions .contact-email, .contact-actions .copy-email") return [email, copy];
      if (selector === ".credentials a") return [certificate];
      if (selector === ".about-portrait") return [portrait];
      throw new Error(`Unexpected selector: ${selector}`);
    },
  };
  const window = { ...events(), matchMedia: () => reduced };
  const context = {
    exports: {}, document, window,
    require: (name) => { assert.equal(name, "react"); return { useEffect: (effect) => { cleanup = effect(); } }; },
    requestAnimationFrame: () => { throw new Error("CSS invitations must not start a JavaScript animation loop"); },
    setTimeout: () => { throw new Error("CSS invitations must not maintain background timers"); },
  };
  if (observerAvailable) context.IntersectionObserver = class {
    constructor(callback, options) { this.callback = callback; this.options = options; this.observed = new Set(); observer = this; }
    observe(node) { this.observed.add(node); }
    unobserve(node) { this.observed.delete(node); }
    disconnect() { this.observed.clear(); this.disconnected = true; }
  };
  vm.runInNewContext(source, context);
  assert.equal(context.exports.DiscoveryCues(), null);
  return {
    currentRole, closedRole, background, email, copy, certificate, portrait, document, reduced, window,
    enter: (node, ratio = .8) => observer?.callback([{ target: node, isIntersecting: true, intersectionRatio: ratio }]),
    leave: (node) => observer?.callback([{ target: node, isIntersecting: false, intersectionRatio: 0 }]),
    observed: (node) => observer?.observed.has(node),
    finish: (node, animationName) => node.fire("animationend", { animationName }),
    hide: () => { document.hidden = true; document.fire("visibilitychange"); },
    show: () => { document.hidden = false; document.fire("visibilitychange"); },
    reduce: (value) => { reduced.matches = value; reduced.fire("change"); },
    beforePrint: () => window.fire("beforeprint"),
    afterPrint: () => window.fire("afterprint"),
    opensWritten: () => opensWritten,
    activated: () => activated,
    unmount: () => {
      cleanup?.();
      if (observer) assert(observer.disconnected, "Unmount must disconnect the observer");
      for (const node of [...allNodes, document, window, reduced]) assert.equal(node.listeners.size, 0, "Unmount must remove every listener");
      allNodes.forEach((node) => assert.deepEqual(node.dataset, originals.get(node), "Unmount must restore all prior dataset values"));
    },
  };
}

const cues = mount();
assert.equal(cues.closedRole.summary.dataset.discoveryCue, undefined, "Essential controls must remain unchanged before reaching the viewport");
cues.enter(cues.closedRole.summary, .2);
assert.equal(cues.closedRole.summary.dataset.discoveryCue, undefined, "A barely visible control should not spend its one-time invitation");
cues.enter(cues.closedRole.summary);
assert.equal(cues.closedRole.summary.dataset.discoveryCue, "disclosure");
assert.equal(cues.closedRole.summary.dataset.discoveryState, "running");
assert.equal(cues.closedRole.details.dataset.discoveryCue, "timeline");
assert.equal(cues.closedRole.details.dataset.discoveryState, "running");
assert.equal(cues.closedRole.details.open, false, "Discovery must never open a closed disclosure");
assert.equal(cues.observed(cues.closedRole.summary), false, "A consumed viewport target must stop being observed");
cues.closedRole.summary.fire("animationend", { animationName: "discovery-chevron", target: {} });
assert.equal(cues.closedRole.summary.dataset.discoveryState, "running", "Nested chevron events must not prematurely end the border trace");
cues.closedRole.summary.fire("focus");
assert.equal(cues.closedRole.summary.dataset.discoveryState, "done", "Focusing a disclosure must stop its invitation");
assert.equal(cues.closedRole.details.dataset.discoveryState, "running", "Interaction must not interrupt the timeline's reading progress");
cues.finish(cues.closedRole.details, "discovery-rail");
cues.enter(cues.closedRole.summary);
assert.equal(cues.closedRole.summary.dataset.discoveryState, "done", "Re-entering the viewport must not repeat a cue");
assert.equal(cues.closedRole.details.dataset.discoveryState, "done");
cues.enter(cues.currentRole.summary);
assert.equal(cues.currentRole.summary.dataset.discoveryState, "done", "Open disclosures do not need an opening invitation");
assert.equal(cues.currentRole.details.open, true, "An already open disclosure must remain open");
assert.equal(cues.currentRole.details.dataset.discoveryState, "running", "Open roles must still advance the timeline rail");
cues.enter(cues.email);
assert.equal(cues.email.dataset.discoveryCue, "contact");
assert.equal(cues.email.dataset.discoveryPaused, undefined);
cues.email.fire("pointerdown");
assert.equal(cues.email.dataset.discoveryState, "done", "Acting on a contact link must consume its invitation");
cues.enter(cues.certificate);
assert.equal(cues.certificate.dataset.discoveryCue, "certificate");
cues.finish(cues.certificate, "discovery-underline");
cues.enter(cues.portrait);
assert.equal(cues.portrait.dataset.discoveryState, "running");
assert.equal(cues.portrait.style.transform, "rotate(-5deg)", "Portrait discovery must preserve its original frame rotation");
cues.finish(cues.portrait, "discovery-portrait-settle");
cues.enter(cues.background.summary);
cues.hide();
assert.equal(cues.background.summary.dataset.discoveryPaused, "true", "A hidden document must pause active CSS invitations");
cues.enter(cues.copy);
assert.equal(cues.copy.dataset.discoveryCue, undefined, "Hidden-page intersection callbacks must not start an invitation");
cues.show();
assert.equal(cues.background.summary.dataset.discoveryPaused, undefined);
assert.equal(cues.copy.dataset.discoveryState, "running", "A visible pending action can begin when the page returns");
cues.reduce(true);
assert.equal(cues.background.summary.dataset.discoveryState, "done", "Runtime reduced motion must finish active decoration");
assert.equal(cues.copy.dataset.discoveryState, "done");
cues.reduce(false);
cues.enter(cues.background.summary);
assert.equal(cues.background.summary.dataset.discoveryState, "done", "Re-enabling motion must not replay consumed invitations");
assert.equal(cues.opensWritten(), 0, "The controller must never write disclosure state");
assert.equal(cues.activated(), 0, "Discovery must never activate or focus a control");
cues.unmount();

const quiet = mount({ reduce: true });
quiet.enter(quiet.closedRole.summary);
quiet.enter(quiet.certificate);
quiet.enter(quiet.portrait);
assert.equal(quiet.closedRole.summary.dataset.discoveryState, "done");
assert.equal(quiet.closedRole.details.dataset.discoveryState, "done");
assert.equal(quiet.certificate.dataset.discoveryState, "done");
assert.equal(quiet.portrait.dataset.discoveryState, "done");
quiet.unmount();

const print = mount();
print.enter(print.closedRole.summary);
print.beforePrint();
assert.equal(print.closedRole.summary.dataset.discoveryState, "done", "Printing must not restart a partly completed invitation");
assert.equal(print.closedRole.details.dataset.discoveryState, "done");
// Simulate the separate disclosure controller preparing and restoring print.
print.background.details.open = true;
print.background.details.fire("toggle");
assert.equal(print.background.summary.dataset.discoveryCue, undefined, "Print-generated toggles must not consume unseen disclosures");
print.background.details.open = false;
print.background.details.fire("toggle");
print.afterPrint();
print.enter(print.background.summary);
assert.equal(print.background.summary.dataset.discoveryState, "running", "A previously unseen cue should remain available after printing");
print.unmount();

const openedByUser = mount();
openedByUser.background.details.open = true;
openedByUser.background.details.fire("toggle");
assert.equal(openedByUser.background.summary.dataset.discoveryState, "done", "Opening a disclosure already answers the invitation");
openedByUser.enter(openedByUser.background.summary);
assert.equal(openedByUser.background.summary.dataset.discoveryState, "done");
openedByUser.unmount();

const unsupported = mount({ observerAvailable: false });
unsupported.enter(unsupported.background.summary);
assert.equal(unsupported.background.summary.dataset.discoveryCue, undefined);
unsupported.unmount();

const css = postcss.parse(readFileSync(new URL("../app/discovery-cues.css", import.meta.url), "utf8"));
css.walkDecls((declaration) => {
  if (declaration.prop.startsWith("animation")) assert(!/\binfinite\b/.test(declaration.value), "Discovery animations must always be finite");
  assert.notEqual(declaration.prop, "will-change", "One-time cues must not reserve permanent compositor layers");
});
css.walkAtRules("keyframes", (rule) => {
  rule.walkDecls((declaration) => assert(["transform", "translate", "opacity"].includes(declaration.prop), "Cue animation must not animate layout, filters or shadows"));
  if (rule.params === "discovery-portrait-settle") rule.walkDecls((declaration) => assert.equal(declaration.prop, "translate", "Portrait motion must preserve its existing transform and visibility"));
});
css.walkRules((rule) => {
  if (rule.selector.includes("disclosure-cue-label__")) rule.walkDecls((declaration) => {
    assert.equal(declaration.prop, "visibility", "Open/close cue labels must swap without changing layout");
  });
});
assert(css.nodes.some((node) => node.type === "atrule" && node.params === "(prefers-reduced-motion: reduce)"));
assert(css.nodes.some((node) => node.type === "atrule" && node.params === "print"));

console.log("Discovery checks passed: one-time viewport invitations, native state preservation, disclosure/timeline/contact/certificate semantics, portrait rotation, interaction cancellation, hidden-page pause, reduced motion, print, cleanup and finite transform/opacity CSS.");
