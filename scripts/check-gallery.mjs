import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the real components and effects. Native focus trapping, image
// decoding and visual transitions still require browser verification.
const source = ts.transpileModule(readFileSync(new URL("../components/summit/ProjectViewer.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function mount(imageCount = 3) {
  const hooks = [];
  const document = { body: { style: { overflow: "clip" } }, activeElement: null };
  let tree, galleryContext, queuedEffects;
  let hookIndex = 0, dirty = false, modalCalls = 0, previousFocus;
  const trigger = (name) => ({ name, isConnected: true, focus(options) { this.focusOptions = options; document.activeElement = this; } });
  const textTrigger = trigger("inspect");
  const imageTrigger = trigger("image");
  const closeButton = trigger("close");
  const dialog = {
    open: false, scrollTop: 240,
    getBoundingClientRect: () => ({ left: 100, top: 80, right: 900, bottom: 680 }),
    showModal() {
      assert.equal(dialog.open, false, "Repeated opening must not re-enter showModal");
      modalCalls++;
      previousFocus = document.activeElement;
      dialog.open = true;
      closeButton.focus();
    },
    close() {
      if (!dialog.open) return;
      dialog.open = false;
      previousFocus?.focus();
      find((node) => node.type === "dialog").props.onClose();
    },
  };
  const jsx = (type, props) => {
    if (type === "dialog" && props.ref) props.ref.current = dialog;
    return { type, props: props ?? {} };
  };
  const react = {
    createContext: (value) => { galleryContext = { current: value, Provider: "provider" }; return galleryContext; },
    useContext: (context) => context.current,
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
    exports: {}, document,
    require: (name) => {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (name === "lucide-react") return new Proxy({}, { get: (_, key) => String(key) });
      if (name === "@/lib/constants") return { RESUME: { youtubeUrl: "https://www.youtube.com/watch?v=example" } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(source, context);
  assert.equal(context.exports.ProjectInspectButton(), null, "Inspect triggers outside a gallery must not be dead controls");
  const independentImage = context.exports.ProjectImageButton({ children: "image" });
  assert.equal(independentImage.props.children, "image", "Images outside a provider must remain visible");
  const images = Array.from({ length: imageCount }, (_, index) => ({ src: `/image-${index}.png`, alt: `Project view ${index + 1}`, width: 1000, height: 700 }));
  const landmark = { title: "Example project", visual: "signal", kicker: "Computer vision", image: images[0], gallery: images.slice(1), description: "What it does", detail: "How it works", tags: ["Python"] };
  const walk = (node, predicate) => {
    if (!node || typeof node !== "object") return null;
    if (predicate(node)) return node;
    return [node.props?.children].flat(Infinity).map((child) => walk(child, predicate)).find(Boolean) ?? null;
  };
  const find = (predicate) => walk(tree, predicate);
  const render = () => {
    do {
      dirty = false; hookIndex = 0; queuedEffects = [];
      tree = context.exports.ProjectViewer({ landmark, children: jsx("stage", { children: "The project content" }) });
      if (tree.type === "provider") galleryContext.current = tree.props.value;
      queuedEffects.forEach((effect) => effect());
    } while (dirty);
  };
  const update = (action) => { const result = action(); if (dirty) render(); return result; };
  const media = () => find((node) => node.props.className === "project-dialog__media");
  const image = () => find((node) => node.type === "img" && node.props.className?.includes("gallery-image"));
  const touchEvent = (touches, changedTouches = []) => ({ touches, changedTouches, target: {}, preventDefault: () => { throw new Error("Swipe handlers must preserve native scrolling and zoom"); } });
  render();
  return {
    document, dialog, textTrigger, imageTrigger, images, find, image, modalCalls: () => modalCalls,
    selected: () => find((node) => node.props["aria-live"] === "polite").props.children[0] - 1,
    textButton: () => context.exports.ProjectInspectButton(),
    imageButton: () => context.exports.ProjectImageButton({ children: jsx("img", { src: "preview.png" }) }),
    open(kind = "text") {
      const button = kind === "text" ? this.textButton() : this.imageButton();
      update(() => button.props.onClick({ currentTarget: kind === "text" ? textTrigger : imageTrigger }));
    },
    click: (label) => update(() => find((node) => node.type === "button" && node.props["aria-label"] === label).props.onClick()),
    close: () => update(() => dialog.close()),
    load: (node = image()) => update(() => node.props.onLoad()),
    fail: () => update(() => image().props.onError()),
    retry: () => update(() => find((node) => node.type === "button" && [node.props.children].flat().includes("Retry preview")).props.onClick()),
    thumbnail: (index) => update(() => find((node) => node.type === "button" && node.props["aria-label"]?.startsWith(`Show image ${index + 1}:`)).props.onClick()),
    key: (key, extra = {}) => {
      let prevented = false;
      update(() => find((node) => node.type === "dialog").props.onKeyDown({ key, target: {}, preventDefault() { prevented = true; }, ...extra }));
      return prevented;
    },
    pointerDown: (x, y, onDialog = true) => find((node) => node.type === "dialog").props.onPointerDown({ clientX: x, clientY: y, target: onDialog ? dialog : {}, currentTarget: dialog }),
    backdropClick: (x, y) => update(() => find((node) => node.type === "dialog").props.onClick({ clientX: x, clientY: y, target: dialog, currentTarget: dialog })),
    pointerCancel: () => find((node) => node.type === "dialog").props.onPointerCancel(),
    touchStart: (touches, target = {}) => media().props.onTouchStart({ ...touchEvent(touches), target }),
    touchMove: (touches) => media().props.onTouchMove(touchEvent(touches)),
    touchEnd: (ended, remaining = []) => update(() => media().props.onTouchEnd(touchEvent(remaining, ended))),
    touchCancel: () => media().props.onTouchCancel(),
    unmount: () => { hooks.forEach((slot) => slot.cleanup?.()); assert.equal(document.body.style.overflow, "clip", "Unmount must release the body scroll lock"); },
  };
}

const gallery = mount();
assert.equal(gallery.image(), null, "Closed galleries must not mount full-size previews");
assert.equal(gallery.textButton().props["aria-controls"], gallery.imageButton().props["aria-controls"], "Both triggers must control the same dialog");
assert.equal(gallery.imageButton().props["aria-haspopup"], "dialog");
assert(gallery.imageButton().props["aria-label"].includes("Example project"));
gallery.open("image");
assert.equal(gallery.dialog.open, true);
assert.equal(gallery.document.body.style.overflow, "hidden");
assert.equal(gallery.dialog.scrollTop, 0);
assert.equal(gallery.selected(), 0);
assert(gallery.find((node) => node.props.className === "media-loading"));
assert.equal(gallery.find((node) => node.props["aria-label"] === "Close gallery").props.autoFocus, true);
assert.equal(gallery.imageTrigger.focusOptions.preventScroll, true, "Opening must focus the exact trigger without moving the page");
gallery.open("text");
assert.equal(gallery.modalCalls(), 1, "An open gallery must ignore duplicate trigger activation");
gallery.load();
assert.equal(gallery.find((node) => node.props.className === "media-loading"), null);
assert(gallery.image().props.className.includes("gallery-image--ready"));
gallery.click("Previous image");
assert.equal(gallery.selected(), 2, "Previous must wrap to the final image");
gallery.click("Next image");
assert.equal(gallery.selected(), 0, "Next must wrap to the first image");
gallery.thumbnail(1);
assert.equal(gallery.selected(), 1);
assert.equal(gallery.find((node) => node.props["aria-label"]?.startsWith("Show image 2:")).props["aria-pressed"], true);
const staleImage = gallery.image();
gallery.thumbnail(2);
gallery.load(staleImage);
assert(gallery.find((node) => node.props.className === "media-loading"), "An old image finishing must not hide the selected image's loading state");
assert(gallery.key("ArrowLeft"));
assert.equal(gallery.selected(), 1);
for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) assert.equal(gallery.key("ArrowRight", { [modifier]: true }), false, "Modified arrow keys must retain browser/text behavior");
assert.equal(gallery.key("ArrowRight", { target: { closest: () => ({}) } }), false, "Editing controls must retain their own arrow keys");
assert.equal(gallery.key("Escape"), false, "Escape must retain native dialog dismissal");
assert.equal(gallery.selected(), 1);
gallery.fail();
assert.equal(gallery.image(), null);
assert.equal(gallery.find((node) => node.props.className === "media-loading"), null, "Image failure must dismiss the loading message");
assert.equal(gallery.find((node) => node.props.className === "media-error").props.role, "status");
assert(gallery.find((node) => node.props.href === "/image-1.png" && node.props.target === "_blank"));
gallery.retry();
assert(gallery.image(), "Retry must remount the failed preview");
assert(gallery.find((node) => node.props.className === "media-loading"));
gallery.load();
gallery.close();
assert.equal(gallery.document.activeElement, gallery.imageTrigger, "Closing must return focus to the specific image trigger");
assert.equal(gallery.document.body.style.overflow, "clip");
gallery.dialog.scrollTop = 400;
gallery.open("text");
assert.equal(gallery.selected(), 0, "Reopening must start at the primary image");
assert.equal(gallery.dialog.scrollTop, 0);
gallery.fail();
gallery.close();
gallery.open("text");
assert(gallery.image(), "Reopening must allow a previously failed image to retry");

const finger = (x, y, identifier = 1) => ({ clientX: x, clientY: y, identifier });
gallery.touchStart([finger(180, 100)]);
gallery.touchMove([finger(150, 101)]);
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 1, "A horizontal left swipe must advance");
gallery.touchStart([finger(70, 100)]);
gallery.touchEnd([finger(180, 101)]);
assert.equal(gallery.selected(), 0, "A horizontal right swipe must go back");
gallery.touchStart([finger(180, 100)]);
gallery.touchMove([finger(178, 135)]);
gallery.touchEnd([finger(20, 140)]);
assert.equal(gallery.selected(), 0, "A gesture that starts scrolling vertically must stay a scroll even if it curves sideways");
gallery.touchStart([finger(180, 100)]);
gallery.touchMove([finger(150, 120)]);
gallery.touchEnd([finger(120, 150)]);
assert.equal(gallery.selected(), 0, "Diagonal gestures must not change the image");
gallery.touchStart([finger(180, 100)]);
gallery.touchEnd([finger(140, 101)]);
assert.equal(gallery.selected(), 0, "Small movements must remain taps");
gallery.touchStart([finger(180, 100)]);
gallery.touchCancel();
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "Cancelled gestures must never navigate");
gallery.touchStart([finger(180, 100)]);
gallery.touchMove([finger(160, 100), finger(210, 130, 2)]);
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "A pinch must cancel the pending swipe");
gallery.touchStart([finger(180, 100), finger(200, 130, 2)]);
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "A gesture beginning with multiple touches must not navigate");
gallery.touchStart([finger(180, 100)]);
gallery.touchEnd([finger(70, 104, 2)]);
assert.equal(gallery.selected(), 0, "A different finger must not complete the swipe");
gallery.touchStart([finger(180, 100)]);
gallery.touchEnd([finger(70, 104)], [finger(200, 120, 2)]);
assert.equal(gallery.selected(), 0, "A gesture with fingers still on screen must not navigate");
gallery.touchStart([finger(180, 100)]);
gallery.touchMove([finger(150, 100, 2)]);
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "A changed touch identifier must invalidate the pending swipe");
gallery.touchStart([finger(180, 100)], { closest: () => ({}) });
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "Links and retry controls inside the media must not initiate swipes");
gallery.touchStart([finger(180, 100)]);
gallery.thumbnail(2);
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 2, "Selecting a thumbnail must discard a pending swipe");
gallery.touchStart([finger(180, 100)]);
gallery.close();
gallery.open("text");
gallery.touchEnd([finger(70, 104)]);
assert.equal(gallery.selected(), 0, "Closing and reopening must clear pending gestures");

gallery.pointerDown(200, 150, false);
gallery.backdropClick(20, 20);
assert.equal(gallery.dialog.open, true, "Dragging out of the media must not dismiss the gallery");
gallery.pointerDown(150, 100);
gallery.backdropClick(150, 100);
assert.equal(gallery.dialog.open, true, "The dialog's own empty surface is not its backdrop");
gallery.pointerDown(20, 20);
gallery.pointerCancel();
gallery.backdropClick(20, 20);
assert.equal(gallery.dialog.open, true, "Cancelled backdrop gestures must not dismiss");
gallery.pointerDown(20, 20);
gallery.backdropClick(20, 20);
assert.equal(gallery.dialog.open, false, "A complete backdrop click must dismiss");
assert.equal(gallery.document.activeElement, gallery.textTrigger, "The text trigger must also regain focus");
gallery.open("text");
gallery.click("Close gallery");
assert.equal(gallery.dialog.open, false);
gallery.open("text");
gallery.unmount();

const single = mount(1);
single.open();
assert.equal(single.find((node) => node.props["aria-label"] === "Next image"), null, "Single-image galleries must not show redundant navigation");
assert.equal(single.key("ArrowRight"), false, "Single-image galleries must not consume arrow keys");
single.touchStart([finger(180, 100)]);
single.touchEnd([finger(70, 104)]);
assert.equal(single.selected(), 0);
single.unmount();
const empty = mount(0);
assert(empty.find((node) => node.type === "stage"), "Missing gallery media must not hide the project content");
empty.unmount();

console.log("Gallery checks passed: shared triggers, native dialog calls, focus targets, scroll locking, image navigation, loading/retry, stale image events, thumbnails, swipe/scroll/pinch/cancel, backdrop intent and cleanup.");
