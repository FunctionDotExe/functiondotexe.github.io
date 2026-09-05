import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (relativePath) => ts.transpileModule(readFileSync(new URL(relativePath, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const geometry = { exports: {} };
vm.runInNewContext(compile("../lib/crystal-geometry.ts"), geometry);
const { createCrystalGeometry, updateCrystalNormals, approachCrystalValues, crystalIndex, crystalProjection, CRYSTAL_CAMERA } = geometry.exports;
const meshes = Array.from({ length: 6 }, (_, index) => createCrystalGeometry(index));

function checkMesh(positions, normals) {
  assert.equal(positions.length % 9, 0);
  assert(positions.every(Number.isFinite), "Every vertex must remain finite");
  assert(normals.every(Number.isFinite), "Every normal must remain finite");
  for (let i = 0; i < normals.length; i += 3) {
    assert(Math.abs(Math.hypot(normals[i], normals[i + 1], normals[i + 2]) - 1) < .00001, "No face may collapse during a morph");
  }
}
for (const [index, mesh] of meshes.entries()) {
  checkMesh(mesh.positions, mesh.normals);
  assert.equal(mesh.vertexCount, meshes[0].vertexCount, "Every study must use a compatible topology");
  assert.equal(mesh.barycentrics.length, mesh.positions.length);
  assert.equal(mesh.edgeMasks.length, mesh.positions.length);
  assert.equal(mesh.facets.length, mesh.vertexCount);
  assert.deepEqual(mesh.positions, createCrystalGeometry(index).positions, "Geometry must be deterministic");
  // Every spire is a closed convex solid. Its faces must wind outward for culling.
  for (let crystal = 0; crystal < 7; crystal++) {
    const start = crystal * 24 * 9;
    const end = start + 24 * 9;
    const center = [0, 0, 0];
    for (let i = start; i < end; i += 3) for (let axis = 0; axis < 3; axis++) center[axis] += mesh.positions[i + axis] / 72;
    for (let i = start; i < end; i += 9) {
      const outward = center.reduce((sum, value, axis) => sum + (mesh.positions[i + axis] - value) * mesh.normals[i + axis], 0);
      assert(outward > .00001, "Back-face culling requires outward-facing winding");
    }
  }
}
for (let a = 0; a < 6; a++) {
  for (let b = a + 1; b < 6; b++) {
    assert.notDeepEqual(meshes[a].positions, meshes[b].positions, "Selecting a study must change the sculpture");
    for (let step = 0; step <= 20; step++) {
      const t = step / 20;
      const positions = meshes[a].positions.map((value, index) => value * (1 - t) + meshes[b].positions[index] * t);
      const normals = new Float32Array(positions.length);
      updateCrystalNormals(positions, normals);
      checkMesh(positions, normals);
    }
  }
}
for (const aspect of [.2, .66, 1, 1.6, 3]) assert(crystalProjection(aspect).every(Number.isFinite));
for (const aspect of [.66, .82, 1, 1.6]) {
  const projection = crystalProjection(aspect);
  for (const mesh of meshes) {
    for (const pitch of [.025, .09]) {
      for (let degree = 0; degree < 360; degree += 5) {
        const yaw = degree / 180 * Math.PI;
        for (let i = 0; i < mesh.positions.length; i += 3) {
          const p = mesh.positions;
          const x = p[i] * Math.cos(yaw) + p[i + 2] * Math.sin(yaw);
          const z = -p[i] * Math.sin(yaw) + p[i + 2] * Math.cos(yaw);
          const y = p[i + 1] * Math.cos(pitch) - z * Math.sin(pitch);
          const rotatedZ = p[i + 1] * Math.sin(pitch) + z * Math.cos(pitch);
          const depth = CRYSTAL_CAMERA[2] - rotatedZ;
          const screenX = (x - CRYSTAL_CAMERA[0]) * projection[0] / depth;
          const screenY = (y - CRYSTAL_CAMERA[1]) * projection[5] / depth;
          assert(Math.abs(screenX) < .98 && screenY < .98, "Every study must stay in frame through a complete rotation");
          assert(screenY > -1 + 88 / 330, "The specimen must leave 44px for controls in the shortest stage");
        }
      }
    }
  }
}
assert.equal(crystalIndex(NaN), 0);
assert.equal(crystalIndex(-1), 0);
assert.equal(crystalIndex(10), 5);
const damped = new Float32Array([0, 1, -1]);
let remaining = 1;
for (let frame = 0; frame < 180 && remaining; frame++) remaining = approachCrystalValues(damped, [1, -1, 0], .15);
assert.equal(remaining, 0, "Damping must reach a finite stop condition");

// Run the real React effect with a deterministic GPU/DOM. This tests scheduling,
// gestures and disposal; shader compilation and appearance still require browser QA.
const component = compile("../components/summit/CrystalScene.tsx");
function mount({ reducedMotion = false, mobile = false, available = true, shaderFailure = false, derivativeFailure = false, derivativesAvailable = true } = {}) {
  let time = 0;
  let serial = 0;
  let ready = false;
  let drawCount = 0;
  let layoutReads = 0;
  let stateUpdates = 0;
  let geometryUploads = 0;
  let observer;
  let resizeObserver;
  let rotation;
  let projection;
  const frames = new Map();
  const refs = [];
  const cleanups = [];
  const resources = new Set();
  const motionRef = { current: null };
  const events = () => {
    const callbacks = new Map();
    return {
      callbacks,
      addEventListener: (name, callback) => callbacks.set(name, callback),
      removeEventListener: (name) => callbacks.delete(name),
      fire: (name, event = {}) => callbacks.get(name)?.({ preventDefault() {}, ...event }),
    };
  };
  const allocate = () => { const resource = { id: ++serial }; resources.add(resource); return resource; };
  const gpu = {
    VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4,
    ARRAY_BUFFER: 5, DYNAMIC_DRAW: 6, STATIC_DRAW: 7, FLOAT: 8, DEPTH_TEST: 9,
    CULL_FACE: 10, BACK: 11, COLOR_BUFFER_BIT: 12, DEPTH_BUFFER_BIT: 16, TRIANGLES: 17, NO_ERROR: 0,
    createShader: allocate, createProgram: allocate, createBuffer: allocate,
    deleteShader: (resource) => resources.delete(resource),
    deleteProgram: (resource) => resources.delete(resource),
    deleteBuffer: (resource) => resources.delete(resource),
    shaderSource: (shader, source) => { shader.source = source; }, compileShader() {}, attachShader() {}, linkProgram() {}, useProgram() {},
    getShaderParameter: (shader) => !shaderFailure && !(derivativeFailure && shader.source.includes("#define HAS_DERIVATIVES")), getProgramParameter: () => true,
    getAttribLocation: () => 0, getUniformLocation: (_, name) => name, getExtension: () => derivativesAvailable ? {} : null,
    getError: () => 0, bindBuffer() {}, enableVertexAttribArray() {}, vertexAttribPointer() {},
    enable() {}, cullFace() {}, clearColor() {}, viewport() {}, clear() {},
    bufferData: (_, values) => assert(values.every(Number.isFinite)),
    bufferSubData: (_, offset, values) => { geometryUploads++; assert(values.every(Number.isFinite)); },
    uniformMatrix4fv: (_, transpose, values) => { projection = new Float32Array(values); assert(values.every(Number.isFinite)); },
    uniform2f: (_, x, y) => { assert(Number.isFinite(x) && Number.isFinite(y)); rotation = [x, y]; },
    uniform3fv: (_, values) => assert(values.every(Number.isFinite)),
    drawArrays: (_, start, count) => { assert.equal(count, meshes[0].vertexCount); drawCount++; },
  };
  const fallback = { style: {} };
  const captures = new Set();
  const root = {
    ...events(), style: {}, dataset: {},
    width: mobile ? 360 : 800, height: 560,
    getBoundingClientRect: () => { layoutReads++; return { width: root.width, height: root.height }; },
    querySelector: () => fallback,
    setPointerCapture: (id) => captures.add(id),
    hasPointerCapture: (id) => captures.has(id),
    releasePointerCapture: (id) => captures.delete(id),
  };
  const canvas = { ...events(), style: {}, getContext: () => available ? gpu : null };
  const motion = { ...events(), matches: reducedMotion };
  const document = { ...events(), hidden: false };
  const window = { ...events(), devicePixelRatio: 3, innerWidth: mobile ? 390 : 1440, matchMedia: () => motion };
  const context = {
    exports: {}, document, window, Element: class {},
    require: (name) => {
      if (name === "@/lib/crystal-geometry") return geometry.exports;
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === "lucide-react") return { RotateCcw: () => null };
      assert.equal(name, "react");
      return {
        useRef: (initial) => { const ref = { current: refs.length === 0 ? root : refs.length === 1 ? canvas : initial }; refs.push(ref); return ref; },
        useEffect: (effect) => { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); },
        useState: () => [false, (value) => { ready = value; stateUpdates++; }],
        useId: () => "crystal-test",
      };
    },
    ResizeObserver: class { constructor(callback) { this.callback = callback; resizeObserver = this; } observe() {} disconnect() { this.disconnected = true; } },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; observer = this; } observe() {} disconnect() { this.disconnected = true; } },
    requestAnimationFrame: (callback) => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  vm.runInNewContext(component, context);
  const markup = context.exports.CrystalScene({ active: 0, motionRef });
  const frame = () => {
    time += 1000 / 60;
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(time));
  };
  return {
    root, canvas, fallback, markup, motion, motionRef, resources, document, window, captures,
    frame, pending: () => frames.size, ready: () => ready, draws: () => drawCount, rotation: () => rotation,
    projection: () => projection,
    layoutReads: () => layoutReads, stateUpdates: () => stateUpdates, geometryUploads: () => geometryUploads,
    reveal: () => observer?.callback([{ isIntersecting: true }]),
    hide: () => observer?.callback([{ isIntersecting: false }]),
    select: (value) => refs[2].current?.select(value),
    reset: () => refs[2].current?.reset(),
    progress: (value) => motionRef.current?.setProgress(value),
    resize: (width, height) => {
      root.width = width;
      root.height = height;
      resizeObserver.callback([{ target: root, contentRect: { width, height } }]);
    },
    key: (key) => root.fire("keydown", { key, target: root }),
    pointer: (name, x, y) => root.fire(name, { pointerId: 1, isPrimary: true, pointerType: "mouse", button: 0, buttons: name === "pointerup" ? 0 : 1, clientX: x, clientY: y }),
    settle: () => { for (let frameCount = 0; frameCount < 240 && frames.size; frameCount++) frame(); assert.equal(frames.size, 0, "The specimen must stop rendering when settled"); },
    loseContext: () => { resources.clear(); canvas.fire("webglcontextlost"); },
    restoreContext: () => canvas.fire("webglcontextrestored"),
    unmount: () => {
      cleanups.forEach((cleanup) => cleanup());
      assert.equal(frames.size, 0, "Unmount must cancel pending frames");
      assert.equal(resources.size, 0, "Unmount must delete all live GPU resources");
      assert.equal(motionRef.current, null, "Unmount must release the external scroll controller");
      for (const target of [root, canvas, document, window, motion]) assert.equal(target.callbacks.size, 0, "Unmount must remove every listener");
      if (observer) assert(observer.disconnected);
      if (resizeObserver) assert(resizeObserver.disconnected);
    },
  };
}

const scene = mount();
assert.equal(scene.pending(), 0, "Off-screen sculptures must not animate");
assert.equal(scene.ready(), false, "Fallback must survive until a successful draw");
scene.reveal();
scene.frame();
assert(scene.ready());
assert.equal(scene.fallback.style.visibility, "hidden");
assert.equal(scene.canvas.width, 1200, "Desktop pixel ratio must be capped at 1.5");
scene.settle();
const initialYaw = scene.rotation()[1];
scene.key("ArrowRight");
scene.settle();
assert(scene.rotation()[1] > initialYaw + .3, "Keyboard controls must rotate the actual model");
scene.reset();
scene.settle();
assert(Math.abs(scene.rotation()[1] - initialYaw) < .0002);
scene.pointer("pointerdown", 100, 100);
scene.pointer("pointerleave", 102, 100);
scene.pointer("pointermove", 180, 100);
assert.equal(scene.pending(), 0, "Leaving before a drag starts must discard the pending gesture");
scene.pointer("pointerdown", 100, 100);
scene.root.fire("pointermove", { pointerId: 1, pointerType: "mouse", buttons: 0, clientX: 180, clientY: 100 });
assert.equal(scene.pending(), 0, "Re-entering after releasing outside must not rotate on hover");
scene.pointer("pointerdown", 100, 100);
scene.pointer("pointermove", 101, 130);
assert.equal(scene.captures.size, 0, "Vertical touch intent must remain available for page scrolling");
assert.equal(scene.pending(), 0);
scene.pointer("pointerdown", 100, 100);
scene.pointer("pointermove", 180, 104);
assert.equal(scene.captures.size, 1, "Horizontal dragging must capture the pointer");
scene.settle();
assert(scene.rotation()[1] > initialYaw + .5);
scene.pointer("pointerup", 180, 104);
assert.equal(scene.captures.size, 0);
scene.select(4);
scene.frame();
assert(scene.pending() > 0, "Study changes should settle across multiple frames");
scene.hide();
assert.equal(scene.pending(), 0, "Leaving the viewport must cancel rendering immediately");
scene.reveal();
scene.settle();
scene.key("ArrowLeft");
scene.document.hidden = true;
scene.document.fire("visibilitychange");
assert.equal(scene.pending(), 0, "Hidden documents must not render");
scene.document.hidden = false;
scene.document.fire("visibilitychange");
scene.settle();
scene.loseContext();
assert.equal(scene.ready(), false);
assert.equal(scene.fallback.style.visibility, "visible", "Context loss must restore the static sculpture");
assert.equal(scene.pending(), 0);
scene.restoreContext();
scene.settle();
assert(scene.ready(), "A restored context must recover without a page reload");
assert.equal(scene.resources.size, 8, "Context restore must allocate exactly one program, two shaders and five buffers");
scene.unmount();

const reduced = mount({ reducedMotion: true, mobile: true });
reduced.reveal();
reduced.frame();
assert.equal(reduced.pending(), 0, "Reduced motion must render the entrance in one frame");
assert.equal(reduced.canvas.width, 450, "Phone pixel ratio must be capped at 1.25");
reduced.select(3);
reduced.frame();
assert.equal(reduced.pending(), 0, "Reduced motion must render study changes in one frame");
reduced.key("ArrowRight");
reduced.frame();
assert.equal(reduced.pending(), 0, "Deliberate keyboard controls must still work without animation");
reduced.unmount();

const scroll = mount({ mobile: true });
assert.equal(typeof scroll.motionRef.current?.setProgress, "function", "Mount must expose the requested scroll controller");
scroll.reveal();
scroll.settle();
const restYaw = scroll.rotation()[1];
const initialLayoutReads = scroll.layoutReads();
const initialStateUpdates = scroll.stateUpdates();
const initialGeometryUploads = scroll.geometryUploads();
scroll.progress(0);
let lastYaw = scroll.rotation()[1];
for (let step = 1; step <= 60; step++) {
  scroll.progress(step / 60);
  scroll.frame();
  assert(scroll.rotation()[1] > lastYaw, "Scrolling down must rotate continuously in the same direction");
  assert(scroll.rotation()[1] - lastYaw < .2, "Ordinary scroll frames must not jump between discrete poses");
  lastYaw = scroll.rotation()[1];
}
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - restYaw - Math.PI * 2) < .0002, "Each scroll stage must complete one revolution");
lastYaw = scroll.rotation()[1];
for (let step = 59; step >= 0; step--) {
  scroll.progress(step / 60);
  scroll.frame();
  assert(scroll.rotation()[1] < lastYaw, "Reverse scrolling must reverse the sculpture naturally");
  lastYaw = scroll.rotation()[1];
}
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - restYaw) < .0002, "Returning to the same scroll position must return to the same pose");
assert.equal(scroll.layoutReads(), initialLayoutReads, "Continuous scroll rendering must not read layout on every frame");
assert.equal(scroll.stateUpdates(), initialStateUpdates, "Scroll updates must not schedule React state renders");
assert.equal(scroll.geometryUploads(), initialGeometryUploads, "Rotation alone must not re-upload vertex geometry");
scroll.progress(0);
assert.equal(scroll.pending(), 0, "An unchanged scroll position must not restart idle rendering");
scroll.progress(NaN);
scroll.progress(Infinity);
assert.equal(scroll.pending(), 0, "Invalid progress must not poison the renderer or schedule work");
for (let step = 1; step <= 12; step++) scroll.progress(step / 12);
assert.equal(scroll.pending(), 1, "Multiple native scroll events must coalesce into one frame");
scroll.settle();
const beforeKey = scroll.rotation()[1];
scroll.key("ArrowRight");
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - beforeKey - .35) < .0002, "Keyboard exploration must offset the scroll pose");
scroll.progress(1.25);
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - beforeKey - Math.PI / 2 - .35) < .0002, "Scroll updates must preserve the manual keyboard offset");
scroll.reset();
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - beforeKey - Math.PI / 2) < .0002, "Reset must remove manual offsets while retaining the active scroll stage");
scroll.pointer("pointerdown", 100, 100);
scroll.pointer("pointermove", 150, 103);
scroll.progress(1.5);
scroll.pointer("pointermove", 200, 103);
scroll.pointer("pointerup", 200, 103);
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - beforeKey - Math.PI - .8) < .0002, "Drag offsets must compose with progress arriving during the drag");
scroll.progress(2);
scroll.frame();
const releasedYaw = scroll.rotation()[1];
scroll.progress(null);
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - releasedYaw) < .00001, "Releasing scroll control must hold the visible pose without catch-up spin");
scroll.key("ArrowLeft");
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - releasedYaw + .35) < .0002, "Manual exploration must work after leaving the scroll sequence");
scroll.reset();
scroll.settle();
assert(Math.abs(scroll.rotation()[1] - restYaw) < .0002, "Reset outside the sequence must restore the original view");
scroll.resize(320, 400);
scroll.frame();
assert.equal(scroll.canvas.width, 400, "ResizeObserver dimensions must update the capped drawing buffer");
assert.equal(scroll.canvas.height, 500);
assert.equal(scroll.layoutReads(), initialLayoutReads, "ResizeObserver dimensions must not trigger a redundant layout read");
scroll.window.fire("resize");
scroll.frame();
assert.equal(scroll.layoutReads(), initialLayoutReads + 1, "Window resizing may measure once, not throughout subsequent rendering");
scroll.hide();
scroll.progress(0);
scroll.progress(5.5);
assert.equal(scroll.pending(), 0, "Off-screen progress updates must not render");
scroll.reveal();
scroll.settle();
assert(Number.isFinite(scroll.rotation()[1]));
scroll.document.hidden = true;
scroll.document.fire("visibilitychange");
scroll.progress(6);
assert.equal(scroll.pending(), 0, "Hidden-document progress updates must not render");
scroll.document.hidden = false;
scroll.document.fire("visibilitychange");
scroll.settle();
const endYaw = scroll.rotation()[1];
scroll.progress(10);
assert.equal(scroll.pending(), 0, "Progress beyond the sequence must clamp without needless work");
assert.equal(scroll.rotation()[1], endYaw);
const detachedController = scroll.motionRef.current;
scroll.unmount();
detachedController.setProgress(0);
assert.equal(scroll.pending(), 0, "An old controller must be inert after unmount");

const quietScroll = mount({ reducedMotion: true, mobile: true });
quietScroll.reveal();
quietScroll.frame();
const quietYaw = quietScroll.rotation()[1];
const quietDraws = quietScroll.draws();
quietScroll.progress(0);
for (let step = 1; step <= 60; step++) quietScroll.progress(step / 10);
assert.equal(quietScroll.pending(), 0, "Reduced motion must suppress scroll-driven spin entirely");
assert.equal(quietScroll.draws(), quietDraws);
assert.equal(quietScroll.rotation()[1], quietYaw);
quietScroll.select(4);
quietScroll.frame();
assert.equal(quietScroll.pending(), 0, "Reduced motion must still apply selected gemstone changes in one frame");
quietScroll.key("ArrowRight");
quietScroll.frame();
assert(Math.abs(quietScroll.rotation()[1] - quietYaw - .35) < .0002);
quietScroll.motion.matches = false;
quietScroll.motion.fire("change");
quietScroll.settle();
const resumeYaw = quietScroll.rotation()[1];
quietScroll.progress(5.9);
quietScroll.settle();
assert(Math.abs(quietScroll.rotation()[1] - resumeYaw + Math.PI / 5) < .0002, "Re-enabling motion must resume from the current pose without replaying skipped turns");
quietScroll.progress(5);
quietScroll.frame();
const motionStoppedYaw = quietScroll.rotation()[1];
quietScroll.motion.matches = true;
quietScroll.motion.fire("change");
quietScroll.frame();
assert.equal(quietScroll.pending(), 0);
assert(Math.abs(quietScroll.rotation()[1] - motionStoppedYaw) < .00001, "Enabling reduced motion must stop an in-flight scroll spin at the visible pose");
quietScroll.unmount();

const compact = mount({ mobile: true });
compact.reveal();
compact.settle();
for (const stageHeight of [165, 180, 240, 330]) {
  compact.resize(360, stageHeight);
  compact.frame();
  const projection = compact.projection();
  for (const mesh of meshes) {
    for (let degree = 0; degree < 360; degree += 10) {
      const yaw = degree / 180 * Math.PI;
      for (let i = 0; i < mesh.positions.length; i += 3) {
        const p = mesh.positions;
        const x = p[i] * Math.cos(yaw) + p[i + 2] * Math.sin(yaw);
        const z = -p[i] * Math.sin(yaw) + p[i + 2] * Math.cos(yaw);
        const y = p[i + 1] * Math.cos(.09) - z * Math.sin(.09);
        const depth = CRYSTAL_CAMERA[2] - p[i + 1] * Math.sin(.09) - z * Math.cos(.09);
        const screenX = (x - CRYSTAL_CAMERA[0]) * projection[0] / depth;
        const screenY = (y - CRYSTAL_CAMERA[1]) * projection[5] / depth - projection[9];
        assert(Math.abs(screenX) < .98 && screenY < .98, "Compact sticky stages must keep the entire gemstone visible");
        assert(screenY > -1 + 88 / stageHeight, "Compact stages must preserve the 44px control area through every rotation");
      }
    }
  }
}
compact.unmount();

for (const options of [{ derivativeFailure: true }, { derivativesAvailable: false }]) {
  const basicShader = mount(options);
  basicShader.reveal();
  basicShader.settle();
  assert(basicShader.ready(), "Optional derivative failure must recover with the basic material");
  assert.equal(basicShader.resources.size, 8, "Retry must delete the failed shader resources");
  basicShader.loseContext();
  basicShader.restoreContext();
  basicShader.settle();
  assert(basicShader.ready(), "Context recovery must retain the derivative fallback");
  basicShader.unmount();
}

for (const options of [{ available: false }, { shaderFailure: true }]) {
  const fallback = mount(options);
  assert.equal(fallback.ready(), false);
  assert.equal(fallback.pending(), 0);
  assert.equal(fallback.motionRef.current, null, "Fallback-only renderers must not expose an unusable scroll controller");
  assert.equal(fallback.markup.props.tabIndex, -1, "A static fallback must not advertise keyboard interaction");
  fallback.unmount();
}

console.log("Crystal checks passed: 6 meshes and morphs, framing, GPU lifecycle, DPR limits, native scroll spin/reversal/manual offsets, cached sizing, reduced motion, gestures, shader fallback, context recovery and idle suspension.");
