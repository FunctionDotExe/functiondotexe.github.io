"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  approachCrystalValues,
  createCrystalGeometry,
  crystalIndex,
  crystalProjection,
  CRYSTAL_CAMERA,
  CRYSTAL_PALETTES,
  updateCrystalNormals,
  type Vec3,
} from "@/lib/crystal-geometry";

const REST_Y = -.38;
const REST_X = .09;
const CAMERA_GLSL = `const vec3 CAMERA = vec3(${CRYSTAL_CAMERA.map((value) => value.toFixed(2)).join(", ")});`;

const VERTEX_SHADER = `
  ${CAMERA_GLSL}
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec3 aBarycentric;
  attribute vec3 aEdgeMask;
  attribute float aFacet;
  uniform vec2 uRotation;
  uniform mat4 uProjection;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPosition;
  varying vec3 vBarycentric;
  varying vec3 vEdgeMask;
  varying float vFacet;

  vec3 rotate(vec3 p) {
    float cy = cos(uRotation.y), sy = sin(uRotation.y);
    float cx = cos(uRotation.x), sx = sin(uRotation.x);
    vec3 q = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
    return vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  }
  void main() {
    vPosition = rotate(aPosition);
    vNormal = rotate(aNormal);
    vLocalPosition = aPosition;
    vBarycentric = aBarycentric;
    vEdgeMask = aEdgeMask;
    vFacet = aFacet;
    gl_Position = uProjection * vec4(vPosition - CAMERA, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  ${CAMERA_GLSL}
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform vec3 uShadow;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPosition;
  varying vec3 vBarycentric;
  varying vec3 vEdgeMask;
  varying float vFacet;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(CAMERA - vPosition);
    vec3 key = normalize(vec3(-0.85, 1.35, 1.1));
    vec3 fill = normalize(vec3(1.2, 0.25, 0.4));
    vec3 rim = normalize(vec3(0.45, 0.9, -1.3));
    float diffuse = max(dot(n, key), 0.0);
    float side = max(dot(n, fill), 0.0);
    float back = max(dot(n, rim), 0.0);
    float fresnel = pow(1.0 - max(dot(n, view), 0.0), 3.2);
    vec3 reflected = reflect(-view, n);
    float sky = smoothstep(-0.45, 0.8, reflected.y);
    float height = smoothstep(-1.2, 1.45, vLocalPosition.y);
    float faceTint = 0.78 + vFacet * 0.30;

    vec3 body = mix(uShadow, uCool * faceTint, 0.16 + diffuse * 0.50 + height * 0.13);
    body += uCool * side * 0.10;
    body += uWarm * back * (0.15 + fresnel * 0.45);
    body = mix(body, mix(uCool * 0.52, uWarm * 0.80, sky), fresnel * 0.53);
    float glint = pow(max(dot(n, normalize(key + view)), 0.0), 100.0);
    float sheen = pow(max(dot(n, normalize(fill + view)), 0.0), 30.0);
    body += uWarm * glint * 0.85 + uCool * sheen * 0.23;

    // Very quiet growth lines live inside the material, not on the silhouette.
    float strata = sin(vLocalPosition.y * 44.0 + vLocalPosition.x * 11.0 + vLocalPosition.z * 7.0);
    body += uCool * pow(max(strata, 0.0), 18.0) * 0.015 * height;
    float foot = smoothstep(-1.19, -0.76, vLocalPosition.y);
    body *= 0.53 + foot * 0.47;

    #ifdef HAS_DERIVATIVES
      vec3 width = max(fwidth(vBarycentric), vec3(0.0001));
      vec3 edge = smoothstep(vec3(0.0), width * 0.80, vBarycentric);
      edge = mix(vec3(1.0), edge, vEdgeMask);
      float outline = 1.0 - min(edge.x, min(edge.y, edge.z));
      body += mix(uCool, uWarm, diffuse) * outline * (0.08 + fresnel * 0.16);
    #endif

    // A restrained filmic curve keeps facets luminous without clipping to white.
    body = body / (body + vec3(0.65));
    gl_FragColor = vec4(pow(body, vec3(0.87)), 1.0);
  }
`;

function cssColor(color: Vec3) {
  return `rgb(${color.map((channel) => Math.round(channel * 255)).join(" ")})`;
}

/** Kept in the server HTML; WebGL only replaces it after the first successful draw. */
function CrystalFallback({ active, id }: { active: number; id: string }) {
  const palette = CRYSTAL_PALETTES[crystalIndex(active)];
  return (
    <svg className="crystal-scene__fallback" viewBox="95 30 450 590" fill="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <linearGradient id={`${id}-face`} x1="190" y1="120" x2="420" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor={cssColor(palette.warm)} /><stop offset=".32" stopColor={cssColor(palette.cool)} /><stop offset="1" stopColor={cssColor(palette.shadow)} />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="260" y1="90" x2="350" y2="490" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0e9ff" /><stop offset=".27" stopColor={cssColor(palette.cool)} /><stop offset="1" stopColor="#413659" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="370" y1="150" x2="280" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor={cssColor(palette.cool)} /><stop offset=".65" stopColor={cssColor(palette.shadow)} /><stop offset="1" stopColor="#20172f" />
        </linearGradient>
      </defs>
      <g stroke={cssColor(palette.cool)} strokeWidth=".65" strokeOpacity=".38" strokeLinejoin="round">
        <path d="M326 150 357 106 392 184 376 452 319 463Z" fill={`url(#${id}-dark)`} />
        <path d="M357 106 352 197 326 150Z" fill={`url(#${id}-light)`} />
        <path d="M357 106 392 184 352 197Z" fill={`url(#${id}-face)`} />
        <path d="M352 197 392 184 376 452 344 475Z" fill={`url(#${id}-dark)`} />
        <path d="M393 292 424 228 453 317 410 493 371 462Z" fill={`url(#${id}-face)`} />
        <path d="M424 228 421 324 393 292Z" fill={`url(#${id}-light)`} />
        <path d="M424 228 453 317 421 324 384 472 393 292Z" fill={`url(#${id}-dark)`} />
        <path d="M180 253 177 167 239 224 291 471 232 481Z" fill={`url(#${id}-face)`} />
        <path d="M177 167 210 252 180 253Z" fill={`url(#${id}-light)`} />
        <path d="M177 167 239 224 210 252Z" fill={`url(#${id}-face)`} />
        <path d="M210 252 239 224 291 471 266 485Z" fill={`url(#${id}-dark)`} />
        <path d="M251 187 298 77 342 192 346 472 275 487Z" fill={`url(#${id}-face)`} />
        <path d="M298 77 300 204 251 187Z" fill={`url(#${id}-light)`} />
        <path d="M298 77 342 192 300 204Z" fill={`url(#${id}-face)`} />
        <path d="M300 204 342 192 346 472 308 490Z" fill={`url(#${id}-dark)`} />
        <path d="M251 187 300 204 308 490 275 487Z" fill={`url(#${id}-light)`} />
        <path d="M359 250 399 177 420 268 375 482 330 479Z" fill={`url(#${id}-face)`} />
        <path d="M399 177 387 282 359 250Z" fill={`url(#${id}-light)`} />
        <path d="M399 177 420 268 387 282Z" fill={`url(#${id}-face)`} />
        <path d="M387 282 420 268 375 482 352 493Z" fill={`url(#${id}-dark)`} />
        <path d="M172 382 157 301 211 350 271 487 228 502Z" fill={`url(#${id}-face)`} />
        <path d="M157 301 191 383 172 382Z" fill={`url(#${id}-light)`} />
        <path d="M157 301 211 350 191 383Z" fill={`url(#${id}-face)`} />
        <path d="M191 383 211 350 271 487 246 510Z" fill={`url(#${id}-dark)`} />
        <path d="M263 359 281 267 324 340 337 493 284 514Z" fill={`url(#${id}-face)`} />
        <path d="M281 267 294 365 263 359Z" fill={`url(#${id}-light)`} />
        <path d="M281 267 324 340 294 365Z" fill={`url(#${id}-face)`} />
        <path d="M294 365 324 340 337 493 312 517Z" fill={`url(#${id}-dark)`} />
        <path d="M363 397 403 313 420 398 386 503 344 495Z" fill={`url(#${id}-face)`} />
        <path d="M403 313 390 411 363 397Z" fill={`url(#${id}-light)`} />
        <path d="M403 313 420 398 390 411 367 506 344 495 363 397Z" fill={`url(#${id}-dark)`} />
        <path d="M208 492 263 467 311 478 375 467 414 492 388 519 308 535 231 519Z" fill={`url(#${id}-dark)`} />
        <path d="M208 492 263 467 308 508 231 519Z" fill={`url(#${id}-face)`} />
        <path d="M263 467 311 478 308 508Z" fill={`url(#${id}-light)`} />
        <path d="M311 478 375 467 414 492 308 508Z" fill={`url(#${id}-face)`} />
        <path d="M308 508 414 492 388 519 308 535Z" fill={`url(#${id}-dark)`} />
      </g>
    </svg>
  );
}

interface CrystalController {
  select: (active: number) => void;
  reset: () => void;
}

export function CrystalScene({ active = 0, className = "" }: { active?: number; className?: string }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CrystalController | null>(null);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(false);
  const id = useId().replace(/:/g, "");
  activeRef.current = active;

  useEffect(() => {
    const element = elementRef.current;
    const canvas = canvasRef.current;
    if (!element || !canvas) return;
    let gl: WebGLRenderingContext | null;
    try {
      gl = canvas.getContext("webgl", { alpha: true, antialias: true, depth: true, stencil: false, premultipliedAlpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    if (!gl) return;
    const context = gl;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const meshes = Array.from({ length: 6 }, (_, index) => createCrystalGeometry(index));
    let selected = crystalIndex(activeRef.current);
    const positions = new Float32Array(meshes[selected].positions);
    const normals = new Float32Array(meshes[selected].normals);
    const cool = new Float32Array(CRYSTAL_PALETTES[selected].cool);
    const warm = new Float32Array(CRYSTAL_PALETTES[selected].warm);
    const shadow = new Float32Array(CRYSTAL_PALETTES[selected].shadow);
    let yaw = REST_Y + (reduced.matches ? 0 : .30);
    let pitch = REST_X + (reduced.matches ? 0 : -.065);
    let targetYaw = REST_Y;
    let targetPitch = REST_X;
    let raf = 0;
    let lastTime = 0;
    let visible = typeof IntersectionObserver === "undefined";
    let disposed = false;
    let lost = false;
    let failed = false;
    let hasRendered = false;
    let geometryDirty = false;
    let width = 0;
    let height = 0;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let normalBuffer: WebGLBuffer | null = null;
    let buffers: WebGLBuffer[] = [];
    let shaders: WebGLShader[] = [];
    let derivativesEnabled = false;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let pointer: { id: number; x: number; y: number; yaw: number; dragging: boolean } | null = null;

    const showRenderer = (available: boolean) => {
      if (disposed) return;
      hasRendered = available;
      canvas.style.visibility = available ? "visible" : "hidden";
      const fallback = element.querySelector<SVGElement>(".crystal-scene__fallback");
      if (fallback) fallback.style.visibility = available ? "hidden" : "visible";
      element.dataset.renderer = available ? "webgl" : "fallback";
      setReady(available);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
    };
    const disposeGPU = () => {
      buffers.forEach((buffer) => context.deleteBuffer(buffer));
      shaders.forEach((shader) => context.deleteShader(shader));
      if (program) context.deleteProgram(program);
      buffers = [];
      shaders = [];
      program = null;
      positionBuffer = null;
      normalBuffer = null;
    };
    const buildGPU = (allowDerivatives = true) => {
      const shader = (kind: number, source: string) => {
        const result = context.createShader(kind);
        if (!result) throw new Error("Shader allocation failed");
        shaders.push(result);
        context.shaderSource(result, source);
        context.compileShader(result);
        if (!context.getShaderParameter(result, context.COMPILE_STATUS)) throw new Error("Shader compilation failed");
        return result;
      };
      const derivatives = allowDerivatives && context.getExtension("OES_standard_derivatives");
      derivativesEnabled = Boolean(derivatives);
      const vertex = shader(context.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = shader(context.FRAGMENT_SHADER, `${derivatives ? "#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIVATIVES\n" : ""}${FRAGMENT_SHADER}`);
      program = context.createProgram();
      if (!program) throw new Error("Program allocation failed");
      context.attachShader(program, vertex);
      context.attachShader(program, fragment);
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error("Program linking failed");
      context.useProgram(program);
      const attribute = (name: string, values: Float32Array, size: number, dynamic = false) => {
        const buffer = context.createBuffer();
        if (!buffer) throw new Error("Buffer allocation failed");
        buffers.push(buffer);
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, values, dynamic ? context.DYNAMIC_DRAW : context.STATIC_DRAW);
        const location = context.getAttribLocation(program!, name);
        if (location >= 0) {
          context.enableVertexAttribArray(location);
          context.vertexAttribPointer(location, size, context.FLOAT, false, 0, 0);
        }
        return buffer;
      };
      positionBuffer = attribute("aPosition", positions, 3, true);
      normalBuffer = attribute("aNormal", normals, 3, true);
      attribute("aBarycentric", meshes[0].barycentrics, 3);
      attribute("aEdgeMask", meshes[0].edgeMasks, 3);
      attribute("aFacet", meshes[0].facets, 1);
      uniforms = Object.fromEntries(["uRotation", "uProjection", "uCool", "uWarm", "uShadow"].map((name) => [name, context.getUniformLocation(program!, name)]));
      context.enable(context.DEPTH_TEST);
      context.enable(context.CULL_FACE);
      context.cullFace(context.BACK);
      context.clearColor(0, 0, 0, 0);
    };
    const initializeGPU = () => {
      try { buildGPU(); }
      catch (error) {
        const retryWithoutEdges = derivativesEnabled;
        disposeGPU();
        if (!retryWithoutEdges) throw error;
        // Some older drivers advertise derivatives but reject their shader path.
        // The sculpture still works without the optional fine edge highlights.
        buildGPU(false);
      }
    };
    const schedule = () => {
      if (!raf && !disposed && !lost && !failed && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const draw = (now: number) => {
      raf = 0;
      if (disposed || lost || failed || !visible || document.hidden) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) { lastTime = 0; return; }
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 640 ? 1.25 : 1.5, 1800 / bounds.width, 1800 / bounds.height);
      const nextWidth = Math.max(1, Math.round(bounds.width * dpr));
      const nextHeight = Math.max(1, Math.round(bounds.height * dpr));
      if (width !== nextWidth || height !== nextHeight) {
        width = canvas.width = nextWidth;
        height = canvas.height = nextHeight;
        context.viewport(0, 0, width, height);
        context.uniformMatrix4fv(uniforms.uProjection, false, crystalProjection(width / height));
      }
      const dt = lastTime ? Math.min(.05, (now - lastTime) / 1000) : 1 / 60;
      lastTime = now;
      const ease = reduced.matches ? 1 : 1 - Math.exp(-dt * (pointer?.dragging ? 19 : 7.5));
      yaw += (targetYaw - yaw) * ease;
      pitch += (targetPitch - pitch) * ease;
      let remaining = Math.max(Math.abs(targetYaw - yaw), Math.abs(targetPitch - pitch));
      if (geometryDirty) {
        const geometryRemaining = approachCrystalValues(positions, meshes[selected].positions, ease);
        updateCrystalNormals(positions, normals);
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        context.bufferSubData(context.ARRAY_BUFFER, 0, positions);
        context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
        context.bufferSubData(context.ARRAY_BUFFER, 0, normals);
        geometryDirty = geometryRemaining > 0;
        remaining = Math.max(remaining, geometryRemaining);
      }
      const palette = CRYSTAL_PALETTES[selected];
      remaining = Math.max(remaining,
        approachCrystalValues(cool, palette.cool, ease),
        approachCrystalValues(warm, palette.warm, ease),
        approachCrystalValues(shadow, palette.shadow, ease));
      context.uniform2f(uniforms.uRotation, pitch, yaw);
      context.uniform3fv(uniforms.uCool, cool);
      context.uniform3fv(uniforms.uWarm, warm);
      context.uniform3fv(uniforms.uShadow, shadow);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
      context.drawArrays(context.TRIANGLES, 0, meshes[0].vertexCount);
      if (!hasRendered) {
        if (context.getError() !== context.NO_ERROR) {
          failed = true;
          disposeGPU();
          return;
        }
        showRenderer(true);
      }
      // No ambient rotation. A settled specimen costs no animation frames.
      if (remaining > .00008) schedule();
      else {
        yaw = targetYaw;
        pitch = targetPitch;
        lastTime = 0;
      }
    };
    const reset = () => {
      // Rebase complete turns so resetting never spins through them.
      yaw = ((yaw - REST_Y + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI + REST_Y;
      targetYaw = REST_Y;
      targetPitch = REST_X;
      schedule();
    };
    const finishPointer = (event?: PointerEvent) => {
      if (event && pointer && event.pointerId !== pointer.id) return;
      if (pointer && element.hasPointerCapture(pointer.id)) element.releasePointerCapture(pointer.id);
      pointer = null;
      delete element.dataset.dragging;
      element.style.cursor = hasRendered ? "grab" : "default";
    };
    const pointerDown = (event: PointerEvent) => {
      if (!hasRendered || !event.isPrimary || event.button !== 0 || (event.target instanceof Element && event.target.closest("button"))) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, dragging: false };
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (event.buttons === 0 && event.pointerType !== "touch") { finishPointer(event); return; }
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.dragging) {
        // Let the browser own vertical gestures, including on the canvas itself.
        if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) { finishPointer(event); return; }
        if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
        pointer.dragging = true;
        element.setPointerCapture(event.pointerId);
        element.dataset.dragging = "true";
        element.style.cursor = "grabbing";
      }
      targetYaw = pointer.yaw + dx * .008;
      schedule();
    };
    const pointerLeave = (event: PointerEvent) => {
      if (!pointer?.dragging) finishPointer(event);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.target !== element || !hasRendered) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        targetYaw += event.key === "ArrowLeft" ? -.35 : .35;
        schedule();
      } else if (event.key === "Home") { event.preventDefault(); reset(); }
    };
    const visibilityChanged = () => {
      if (document.hidden) { finishPointer(); stop(); }
      else schedule();
    };
    const motionChanged = () => { schedule(); };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      stop();
      finishPointer();
      showRenderer(false);
    };
    const contextRestored = () => {
      // Objects from the lost context are invalid; allocate one fresh set.
      buffers = [];
      shaders = [];
      program = null;
      lost = false;
      failed = false;
      width = 0;
      height = 0;
      try { initializeGPU(); schedule(); }
      catch { failed = true; disposeGPU(); showRenderer(false); }
    };

    try { initializeGPU(); }
    catch { disposeGPU(); return; }
    controllerRef.current = {
      select: (value) => {
        const next = crystalIndex(value);
        if (next === selected) return;
        selected = next;
        geometryDirty = true;
        schedule();
      },
      reset,
    };
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resize?.observe(element);
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { finishPointer(); stop(); }
    }, { threshold: 0 });
    intersection?.observe(element);
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerleave", pointerLeave);
    element.addEventListener("pointerup", finishPointer);
    element.addEventListener("pointercancel", finishPointer);
    element.addEventListener("lostpointercapture", finishPointer);
    element.addEventListener("keydown", keyDown);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    document.addEventListener("visibilitychange", visibilityChanged);
    reduced.addEventListener("change", motionChanged);
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      finishPointer();
      disposed = true;
      stop();
      controllerRef.current = null;
      resize?.disconnect();
      intersection?.disconnect();
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerleave", pointerLeave);
      element.removeEventListener("pointerup", finishPointer);
      element.removeEventListener("pointercancel", finishPointer);
      element.removeEventListener("lostpointercapture", finishPointer);
      element.removeEventListener("keydown", keyDown);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      document.removeEventListener("visibilitychange", visibilityChanged);
      reduced.removeEventListener("change", motionChanged);
      window.removeEventListener("resize", schedule);
      disposeGPU();
    };
  }, []);

  useEffect(() => { controllerRef.current?.select(active); }, [active]);

  return (
    <div ref={elementRef} className={`crystal-scene ${className}`} role="group" tabIndex={ready ? 0 : -1} aria-label={ready ? "Interactive crystal sculpture" : "Faceted crystal sculpture"} aria-describedby={`${id}-hint`} aria-keyshortcuts={ready ? "ArrowLeft ArrowRight Home" : undefined} style={{ position: "relative", width: "100%", touchAction: "pan-y", cursor: ready ? "grab" : "default", isolation: "isolate" }}>
      <svg className="crystal-scene__shadow" viewBox="95 30 450 590" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs><radialGradient id={`${id}-shadow`}><stop stopColor="#0d091b" stopOpacity=".38" /><stop offset="1" stopColor="#0d091b" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx="320" cy="550" rx="160" ry="30" fill={`url(#${id}-shadow)`} />
      </svg>
      <CrystalFallback active={active} id={id} />
      <canvas ref={canvasRef} className="crystal-scene__canvas" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", visibility: ready ? "visible" : "hidden", touchAction: "pan-y" }} />
      <div className="crystal-scene__controls" style={{ position: "absolute", insetInline: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", minHeight: "44px" }}>
        <span id={`${id}-hint`} className="crystal-scene__hint">{ready ? "Drag to explore · ← → to rotate" : "Faceted mineral study"}</span>
        {ready && <button type="button" className="crystal-scene__reset icon-button" onClick={() => controllerRef.current?.reset()} aria-label="Reset crystal view" title="Reset view"><RotateCcw size={15} aria-hidden="true" /></button>}
      </div>
    </div>
  );
}
