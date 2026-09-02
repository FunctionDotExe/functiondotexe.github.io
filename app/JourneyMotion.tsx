"use client";

import { useEffect } from "react";

type MeasuredScene = {
  element: HTMLElement;
  top: number;
  height: number;
};

type ViewportMetrics = {
  height: number;
  width: number;
  pageRange: number;
  motionScale: number;
};

type DepthPlane = "back" | "atmosphere" | "mid" | "near";

type CameraShot = {
  at: number;
  y: number;
  x: number;
};

type ContinuumState = {
  progress: number;
  local: number;
};

const DEPTH_PLANES: DepthPlane[] = ["back", "atmosphere", "mid", "near"];

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (start: number, end: number, value: number) => {
  const progress = clamp((value - start) / Math.max(end - start, Number.EPSILON));
  return progress * progress * (3 - 2 * progress);
};

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const sampleCameraShots = (shots: CameraShot[], scrollY: number): CameraShot => {
  if (scrollY <= shots[0].at) return shots[0];

  for (let index = 1; index < shots.length; index += 1) {
    const next = shots[index];
    if (scrollY > next.at) continue;

    const previous = shots[index - 1];
    const amount = smoothstep(previous.at, next.at, scrollY);
    return {
      at: scrollY,
      y: mix(previous.y, next.y, amount),
      x: mix(previous.x, next.x, amount),
    };
  }

  return shots[shots.length - 1];
};

export function JourneyMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector<HTMLElement>("#main-content");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visualViewport = window.visualViewport;

    const heroElement = document.querySelector<HTMLElement>(".journey-hero");
    const basecampElement = document.querySelector<HTMLElement>(".basecamp-scene");
    const climbElement = document.querySelector<HTMLElement>(".climb");
    const journeyWorldElement = document.querySelector<HTMLElement>(
      ".journey-world",
    );
    const surfaceChapterElement = document.querySelector<HTMLElement>(
      '[data-journey-chapter="surface"]',
    );
    const depthChapterElement = document.querySelector<HTMLElement>(
      '[data-journey-chapter="depth"]',
    );
    const thresholdElement = document.querySelector<HTMLElement>(
      ".descent-threshold",
    );
    const surfaceRealmElement = document.querySelector<HTMLElement>(
      ".journey-world__realm--surface",
    );
    const depthRealmElement = document.querySelector<HTMLElement>(
      ".journey-world__realm--depth",
    );
    const continuumRealmElement = document.querySelector<HTMLElement>(
      ".journey-world__realm--continuum",
    );
    const continuumPlateElement = document.querySelector<HTMLImageElement>(
      ".journey-world__continuum-plate",
    );
    const depthPlates: Record<DepthPlane, HTMLImageElement | null> = {
      back: document.querySelector<HTMLImageElement>(
        ".journey-world__depth-layer--back .journey-world__depth-plate",
      ),
      atmosphere: document.querySelector<HTMLImageElement>(
        ".journey-world__depth-layer--atmosphere .journey-world__depth-plate",
      ),
      mid: document.querySelector<HTMLImageElement>(
        ".journey-world__depth-layer--mid .journey-world__depth-plate",
      ),
      near: document.querySelector<HTMLImageElement>(
        ".journey-world__depth-layer--near .journey-world__depth-plate",
      ),
    };
    const sceneElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-journey-scene]"),
    );

    let hero: MeasuredScene | null = null;
    let basecamp: MeasuredScene | null = null;
    let climb: MeasuredScene | null = null;
    let surfaceChapter: MeasuredScene | null = null;
    let depthChapter: MeasuredScene | null = null;
    let threshold: MeasuredScene | null = null;
    let continuumTravel = 0;
    let depthTravels: Record<DepthPlane, number> = {
      back: 0,
      atmosphere: 0,
      mid: 0,
      near: 0,
    };
    let scenes: MeasuredScene[] = [];
    let depthScenes: MeasuredScene[] = [];
    let metrics: ViewportMetrics = {
      height: Math.max(window.innerHeight, 1),
      width: Math.max(window.innerWidth, 1),
      pageRange: 1,
      motionScale: 1,
    };

    const writtenStyles = new Map<HTMLElement, Map<string, string>>();
    const managedInert = new Map<HTMLElement, boolean>();
    const managedScenes = new Set<HTMLElement>();
    let animationFrame = 0;
    let needsMeasure = true;
    let disposed = false;
    let scrollListening = false;
    let motionIsReduced = reducedMotion.matches;
    let cameraScrollY = window.scrollY;
    let lastFrameTime = performance.now();
    let hasRenderedFrame = false;

    const writeStyle = (element: HTMLElement, property: string, value: string) => {
      let elementStyles = writtenStyles.get(element);
      if (!elementStyles) {
        elementStyles = new Map<string, string>();
        writtenStyles.set(element, elementStyles);
      }

      if (elementStyles.get(property) === value) return;
      elementStyles.set(property, value);
      element.style.setProperty(property, value);
    };

    const resetWrittenStyles = () => {
      writtenStyles.forEach((properties, element) => {
        properties.forEach((_value, property) => element.style.removeProperty(property));
      });
      writtenStyles.clear();
    };

    const writeInert = (element: HTMLElement, inert: boolean) => {
      if (!managedInert.has(element)) {
        managedInert.set(element, element.hasAttribute("inert"));
      }
      if (element.hasAttribute("inert") !== inert) {
        element.toggleAttribute("inert", inert);
      }
    };

    const writeSceneInteractivity = (element: HTMLElement, interactive: boolean) => {
      const activeElement = document.activeElement;
      const containsFocus =
        activeElement instanceof HTMLElement && element.contains(activeElement);
      const shouldBeInteractive = interactive || containsFocus;

      managedScenes.add(element);
      element.classList.toggle("journey-scene--interactive", shouldBeInteractive);
      element
        .querySelectorAll<HTMLElement>("a, button, input, select, textarea, [tabindex]")
        .forEach((control) => writeInert(control, !shouldBeInteractive));
    };

    const resetManagedInert = () => {
      managedInert.forEach((wasInert, element) => {
        element.toggleAttribute("inert", wasInert);
      });
      managedInert.clear();
      managedScenes.forEach((element) => {
        element.classList.remove("journey-scene--interactive");
        element.classList.remove("journey-scene--active");
      });
      managedScenes.clear();
    };

    const measureElement = (
      element: HTMLElement | null,
      scrollY: number,
    ): MeasuredScene | null => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { element, top: rect.top + scrollY, height: rect.height };
    };

    const readMeasurements = (scrollY: number) => {
      const viewportHeight = Math.max(
        journeyWorldElement?.clientHeight ?? window.innerHeight,
        1,
      );
      const viewportWidth = Math.max(window.innerWidth, 1);

      metrics = {
        height: viewportHeight,
        width: viewportWidth,
        pageRange: Math.max(document.documentElement.scrollHeight - viewportHeight, 1),
        motionScale:
          (viewportWidth <= 720 ? 0.52 : viewportWidth <= 980 ? 0.74 : 1) *
          (viewportHeight <= 650 ? 0.72 : 1),
      };

      hero = measureElement(heroElement, scrollY);
      basecamp = measureElement(basecampElement, scrollY);
      climb = measureElement(climbElement, scrollY);
      surfaceChapter = measureElement(surfaceChapterElement, scrollY);
      depthChapter = measureElement(depthChapterElement, scrollY);
      threshold = measureElement(thresholdElement, scrollY);
      continuumTravel = Math.max(
        (continuumPlateElement?.offsetHeight ?? viewportHeight) - viewportHeight,
        0,
      );
      scenes = sceneElements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, top: rect.top + scrollY, height: rect.height };
      });
      depthScenes = scenes.filter(
        (scene) => scene.element.closest(".earth-journey") !== null,
      );
      depthTravels = DEPTH_PLANES.reduce<Record<DepthPlane, number>>(
        (travels, plane) => {
          const plateHeight = depthPlates[plane]?.offsetHeight ?? viewportHeight;
          travels[plane] = Math.max(plateHeight - viewportHeight, 0);
          return travels;
        },
        { back: 0, atmosphere: 0, mid: 0, near: 0 },
      );
      needsMeasure = false;
    };

    const sectionProgress = (
      scene: MeasuredScene | null,
      scrollY: number,
      viewportHeight: number,
    ) => {
      if (!scene) return 0;
      return clamp((scrollY - scene.top) / Math.max(scene.height - viewportHeight, 1));
    };

    const normalFlowDepthAt = (scrollY: number, viewportHeight: number) =>
      depthChapter
        ? smoothstep(
            depthChapter.top - viewportHeight * 0.24,
            depthChapter.top,
            scrollY,
          )
        : 0;

    const continuumStateAt = (
      scrollY: number,
      viewportHeight: number,
    ): ContinuumState => {
      const start = threshold?.top ?? depthChapter?.top ?? 0;
      const range = threshold
        ? Math.max(threshold.height - viewportHeight, 1)
        : Math.max(continuumTravel, 1);
      const travel = Math.max(Math.min(continuumTravel, range), 1);
      const local = clamp(scrollY - start, 0, travel);

      return {
        progress: clamp(local / travel),
        local,
      };
    };

    const enteringProgress = (
      scene: MeasuredScene | null,
      scrollY: number,
      viewportHeight: number,
    ) => {
      if (!scene) return 0;
      return clamp(
        (scrollY + viewportHeight - scene.top) /
          Math.max(scene.height + viewportHeight, 1),
      );
    };

    const isNearViewport = (
      scene: MeasuredScene,
      scrollY: number,
      viewportHeight: number,
    ) =>
      scene.top + scene.height >= scrollY - viewportHeight * 1.5 &&
      scene.top <= scrollY + viewportHeight * 2.5;

    const writeRootWorld = (
      surfaceProgress: number,
      motionScale: number,
    ) => {
      const worldTarget = journeyWorldElement ?? root;
      const centered = surfaceProgress - 0.5;
      const depthOffset = (distance: number) => {
        const value = -centered * distance * motionScale;
        return `${value.toFixed(3)}px`;
      };

      writeStyle(worldTarget, "--world-sky-y", depthOffset(14));
      writeStyle(worldTarget, "--world-clouds-y", depthOffset(42));
      writeStyle(
        worldTarget,
        "--world-clouds-x",
        `${(centered * 16 * motionScale).toFixed(3)}px`,
      );
      writeStyle(worldTarget, "--world-valley-y", depthOffset(74));
      writeStyle(worldTarget, "--world-trail-y", depthOffset(92));
      writeStyle(worldTarget, "--world-foreground-y", depthOffset(120));
      writeStyle(
        worldTarget,
        "--world-trail-x",
        "0px",
      );
      writeStyle(
        worldTarget,
        "--world-foreground-x",
        "0px",
      );
    };

    const depthCameraShots = (viewportHeight: number): CameraShot[] => {
      if (!depthChapter) {
        return [{ at: 0, y: 0, x: 0 }];
      }

      const chapterEnd =
        depthChapter.top + Math.max(depthChapter.height - viewportHeight, 1);
      const transitionEnd = threshold
        ? threshold.top + Math.max(threshold.height - viewportHeight, 1)
        : depthChapter.top;
      const targetY = [0, 0.22, 0.48, 0.74, 1];
      const targetX = [0, 0.058, -0.064, 0.072, 0];

      const shots = targetY.map((y, index) => {
        if (index === 0) {
          return { at: transitionEnd, y, x: targetX[index] };
        }

        const scene = depthScenes[index];
        const fallback = mix(transitionEnd, chapterEnd, index / (targetY.length - 1));
        const stickyRange = scene
          ? Math.max(scene.height - viewportHeight, viewportHeight * 0.35)
          : 0;
        const sceneAnchor = scene
          ? scene.top + stickyRange * (index === targetY.length - 1 ? 0.72 : 0.5)
          : fallback;

        return {
          at: Math.min(sceneAnchor, chapterEnd),
          y,
          x: targetX[index],
        };
      });

      for (let index = 1; index < shots.length; index += 1) {
        shots[index].at = Math.max(shots[index].at, shots[index - 1].at + 1);
      }

      return shots;
    };

    const writeDepthWorld = (
      scrollY: number,
      worldScrollY: number,
      motionScale: number,
      viewportHeight: number,
      viewportWidth: number,
      continuumState: ContinuumState,
      depthUsesNormalFlow: boolean,
    ) => {
      const thresholdStart = threshold?.top ?? depthChapter?.top ?? 0;
      const thresholdEnd = thresholdStart + Math.max(continuumTravel, 1);
      const normalFlowDepth = normalFlowDepthAt(worldScrollY, viewportHeight);
      const surfaceOpacity = depthUsesNormalFlow
        ? 1 - normalFlowDepth
        : 1;
      const realmOpacity = depthUsesNormalFlow
        ? normalFlowDepth
        : 1;
      const continuumIsActive =
        !depthUsesNormalFlow &&
        scrollY >= thresholdStart &&
        scrollY <= thresholdEnd;
      const shouldPrewarmDepth = depthUsesNormalFlow
        ? Boolean(
            depthChapter && scrollY >= depthChapter.top - viewportHeight * 0.35,
          )
        : scrollY >= thresholdEnd - viewportHeight * 1.2;
      const thresholdCopyOpacity = depthUsesNormalFlow
        ? 1
        : smoothstep(0.22, 0.34, continuumState.progress) *
          (1 - smoothstep(0.66, 0.8, continuumState.progress));
      const shot = sampleCameraShots(
        depthCameraShots(viewportHeight),
        worldScrollY,
      );
      const depthPulse =
        Math.sin(shot.y * Math.PI * 3.5) *
        Math.sin(shot.y * Math.PI) ** 2 *
        viewportHeight *
        0.045 *
        motionScale;
      const deepHeat = smoothstep(0.46, 0.94, shot.y);
      const planeFactors: Record<DepthPlane, number> = {
        back: 0.18,
        atmosphere: 0.34,
        mid: 0.68,
        near: 1,
      };
      const climbTarget = climbElement ?? root;
      const thresholdTarget = thresholdElement ?? root;
      const depthTarget = depthRealmElement ?? root;

      if (surfaceRealmElement) {
        writeStyle(
          surfaceRealmElement,
          "--surface-realm-opacity",
          surfaceOpacity.toFixed(4),
        );
        writeStyle(
          surfaceRealmElement,
          "visibility",
          (depthUsesNormalFlow && surfaceOpacity > 0.001) ||
            (!depthUsesNormalFlow && scrollY < thresholdStart)
            ? "visible"
            : "hidden",
        );
      }
      if (continuumRealmElement) {
        writeStyle(
          continuumRealmElement,
          "--continuum-y",
          `${(-continuumState.local).toFixed(2)}px`,
        );
        writeStyle(
          continuumRealmElement,
          "visibility",
          continuumIsActive ? "visible" : "hidden",
        );
      }
      if (depthRealmElement) {
        writeStyle(
          depthRealmElement,
          "--depth-realm-opacity",
          realmOpacity.toFixed(4),
        );
        writeStyle(
          depthRealmElement,
          "visibility",
          shouldPrewarmDepth ? "visible" : "hidden",
        );
      }
      writeStyle(
        climbTarget,
        "--climb-hud-opacity",
        (
          depthUsesNormalFlow
            ? 1 - normalFlowDepth
            : 1 - smoothstep(0, 0.12, continuumState.progress)
        ).toFixed(4),
      );
      writeStyle(
        thresholdTarget,
        "--threshold-copy-opacity",
        thresholdCopyOpacity.toFixed(4),
      );
      writeStyle(
        thresholdTarget,
        "--threshold-tint-opacity",
        (depthUsesNormalFlow ? 0.42 : thresholdCopyOpacity * 0.18).toFixed(4),
      );
      writeStyle(
        thresholdTarget,
        "--threshold-copy-y",
        `${(
          depthUsesNormalFlow
            ? 0
            : (1 - smoothstep(0.2, 0.42, continuumState.progress)) *
              32 *
              motionScale
        ).toFixed(2)}px`,
      );

      for (const plane of DEPTH_PLANES) {
        const factor = planeFactors[plane];
        const x = -shot.x * viewportWidth * factor * motionScale;
        const y = -depthTravels[plane] * shot.y - depthPulse * factor;
        writeStyle(depthTarget, `--depth-${plane}-x`, `${x.toFixed(2)}px`);
        writeStyle(depthTarget, `--depth-${plane}-y`, `${y.toFixed(2)}px`);
      }

      writeStyle(
        depthTarget,
        "--depth-atmosphere-opacity",
        (0.42 + deepHeat * 0.2).toFixed(3),
      );
      writeStyle(depthTarget, "--depth-mid-opacity", "1");
      writeStyle(depthTarget, "--depth-near-opacity", "1");
      writeStyle(
        depthTarget,
        "--depth-shade-opacity",
        (0.07 + deepHeat * 0.11).toFixed(3),
      );
    };

    const writeBasecampMotion = (
      progress: number,
      motionScale: number,
    ) => {
      if (!basecamp) return;

      const copyExit = smoothstep(0.52, 0.7, progress);
      const values = {
        "--basecamp-copy-opacity": (1 - copyExit).toFixed(4),
        "--basecamp-copy-y": `${(-copyExit * 64 * motionScale).toFixed(2)}px`,
      };

      for (const [property, value] of Object.entries(values)) {
        writeStyle(basecamp.element, property, value);
      }

      writeSceneInteractivity(basecamp.element, copyExit <= 0.94);
    };

    const writeMotion = (scrollY: number, worldScrollY: number) => {
      const {
        height: viewportHeight,
        width: viewportWidth,
        motionScale,
      } = metrics;
      const depthUsesNormalFlow =
        viewportHeight <= 600 && viewportWidth > viewportHeight;
      const basecampProgress = enteringProgress(
        basecamp,
        worldScrollY,
        viewportHeight,
      );
      const climbProgress = sectionProgress(climb, worldScrollY, viewportHeight);
      const surfaceProgress = sectionProgress(
        surfaceChapter,
        worldScrollY,
        viewportHeight,
      );
      const continuumState = continuumStateAt(scrollY, viewportHeight);

      writeRootWorld(surfaceProgress, motionScale);
      writeDepthWorld(
        scrollY,
        worldScrollY,
        motionScale,
        viewportHeight,
        viewportWidth,
        continuumState,
        depthUsesNormalFlow,
      );

      if (hero && isNearViewport(hero, worldScrollY, viewportHeight)) {
        const progress = clamp(
          (worldScrollY - hero.top) /
            Math.max(hero.height - viewportHeight * 0.35, 1),
        );
        const copyOpacity = clamp(1 - progress * 1.35);
        writeStyle(hero.element, "--hero-progress", progress.toFixed(4));
        writeStyle(
          hero.element,
          "--hero-backdrop-y",
          `${(progress * -34 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          hero.element,
          "--hero-foreground-y",
          `${(progress * 96 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          hero.element,
          "--hero-copy-y",
          `${(progress * -76 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          hero.element,
          "--hero-copy-opacity",
          copyOpacity.toFixed(3),
        );
        writeStyle(
          hero.element,
          "--hero-footer-opacity",
          clamp(1 - progress * 2.4).toFixed(3),
        );
        writeStyle(
          hero.element,
          "--hero-depth-scale",
          (1 + progress * 0.045 * motionScale).toFixed(4),
        );
        writeSceneInteractivity(hero.element, copyOpacity >= 0.06);
      }

      writeBasecampMotion(basecampProgress, motionScale);

      if (climb && isNearViewport(climb, worldScrollY, viewportHeight)) {
        const centered = climbProgress - 0.5;
        const peakBridgeOpacity = smoothstep(0.75, 0.98, climbProgress);
        writeStyle(climb.element, "--climb-progress", climbProgress.toFixed(4));
        writeStyle(
          climb.element,
          "--climb-backdrop-y",
          `${(centered * 104 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          climb.element,
          "--climb-foreground-y",
          `${(centered * 176 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          climb.element,
          "--climb-scale",
          (1.08 + climbProgress * 0.055 * motionScale).toFixed(4),
        );
        writeStyle(
          climb.element,
          "--climb-foreground-scale",
          (1.03 + climbProgress * 0.04 * motionScale).toFixed(4),
        );
        writeStyle(
          climb.element,
          "--climb-light-x",
          `${(18 + climbProgress * 58).toFixed(2)}%`,
        );
        writeStyle(
          climb.element,
          "--climb-light-y",
          `${(78 - climbProgress * 42).toFixed(2)}%`,
        );
        writeStyle(climb.element, "--climb-fill", climbProgress.toFixed(4));
        writeStyle(
          climb.element,
          "--peak-bridge-opacity",
          peakBridgeOpacity.toFixed(4),
        );
      }

      const viewportCenter = scrollY + viewportHeight / 2;
      const activeScene = scenes.find(
        (scene) =>
          viewportCenter >= scene.top &&
          viewportCenter < scene.top + scene.height,
      );

      for (const scene of scenes) {
        const isActive = scene === activeScene;
        const isNormalFlowDepthScene =
          depthUsesNormalFlow && scene.element.closest(".earth-journey") !== null;
        const sceneCopyIsReady =
          scene.element !== thresholdElement ||
          depthUsesNormalFlow ||
          continuumState.progress >= 0.22;

        scene.element.classList.toggle("journey-scene--active", isActive);

        if (!isNearViewport(scene, scrollY, viewportHeight)) {
          writeStyle(
            scene.element,
            "--scene-focus",
            isNormalFlowDepthScene ? "1" : "0",
          );
          writeStyle(scene.element, "--scene-tint-opacity", "0");
          writeSceneInteractivity(
            scene.element,
            isNormalFlowDepthScene && sceneCopyIsReady,
          );
          continue;
        }

        const centerOffset = clamp(
          (scene.top + scene.height / 2 - (scrollY + viewportHeight / 2)) /
            viewportHeight,
          -1.25,
          1.25,
        );
        const focus = isActive || isNormalFlowDepthScene ? 1 : 0;
        writeStyle(scene.element, "--scene-focus", focus.toFixed(3));
        writeSceneInteractivity(
          scene.element,
          (isNormalFlowDepthScene || isActive) && sceneCopyIsReady,
        );
        writeStyle(
          scene.element,
          "--scene-tint-opacity",
          (
            focus * (scene.element.closest(".earth-journey") ? 0.42 : 0.62)
          ).toFixed(3),
        );
        writeStyle(
          scene.element,
          "--copy-shift",
          `${(centerOffset * 24 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          scene.element,
          "--artifact-shift",
          `${(centerOffset * -42 * motionScale).toFixed(2)}px`,
        );
        writeStyle(
          scene.element,
          "--artifact-scale",
          (0.965 + focus * 0.035).toFixed(4),
        );
      }
    };

    const runFrame = (time: number) => {
      animationFrame = 0;
      if (disposed || motionIsReduced) return;

      const scrollY = window.scrollY;
      if (needsMeasure) {
        readMeasurements(scrollY);
        if (!hasRenderedFrame) {
          cameraScrollY = scrollY;
        }
      }

      const elapsed = clamp(time - lastFrameTime, 8, 48);
      const cameraTarget = clamp(scrollY, 0, metrics.pageRange);
      const cameraFollow = 1 - Math.exp(-elapsed / 72);
      cameraScrollY += (cameraTarget - cameraScrollY) * cameraFollow;
      lastFrameTime = time;

      writeMotion(scrollY, cameraScrollY);
      hasRenderedFrame = true;

      if (!root.classList.contains("journey-motion-ready")) {
        // Viewport-fixed panels keep their semantic content available to
        // assistive technology, while hidden controls and pointer surfaces
        // stay inactive. The loop above re-enables every visible scene.
        sceneElements.forEach((element) => {
          if (!element.style.getPropertyValue("--scene-focus")) {
            writeSceneInteractivity(element, false);
          }
        });
        root.classList.add("journey-motion-ready");
      }
      if (root.dataset.motion !== "active") root.dataset.motion = "active";

      const cameraIsSettling = Math.abs(cameraTarget - cameraScrollY) > 0.12;
      if (cameraIsSettling) scheduleUpdate();
    };

    const scheduleUpdate = () => {
      if (disposed || motionIsReduced || animationFrame) return;
      animationFrame = window.requestAnimationFrame(runFrame);
    };

    const requestMeasure = () => {
      if (disposed || motionIsReduced) return;
      needsMeasure = true;
      scheduleUpdate();
    };

    const onScroll = () => scheduleUpdate();

    const attachScrollListener = () => {
      if (scrollListening) return;
      window.addEventListener("scroll", onScroll, { passive: true });
      scrollListening = true;
    };

    const detachScrollListener = () => {
      if (!scrollListening) return;
      window.removeEventListener("scroll", onScroll);
      scrollListening = false;
    };

    const applyMotionPreference = () => {
      const shouldReduce = reducedMotion.matches;
      motionIsReduced = shouldReduce;

      if (shouldReduce) {
        detachScrollListener();
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        resetWrittenStyles();
        resetManagedInert();
        root.classList.remove("journey-motion-ready");
        if (root.dataset.motion !== "reduced") root.dataset.motion = "reduced";
        needsMeasure = true;
        cameraScrollY = window.scrollY;
        hasRenderedFrame = false;
        return;
      }

      attachScrollListener();
      needsMeasure = true;
      cameraScrollY = window.scrollY;
      lastFrameTime = performance.now();
      hasRenderedFrame = false;
      scheduleUpdate();
    };

    const onMotionPreferenceChange = () => applyMotionPreference();
    const onResize = () => requestMeasure();
    const onLoad = () => requestMeasure();
    const onPageShow = () => requestMeasure();
    const resizeObserver =
      main && "ResizeObserver" in window
        ? new ResizeObserver(() => requestMeasure())
        : null;

    if (main) resizeObserver?.observe(main);
    window.addEventListener("resize", onResize);
    visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad, { once: true });
    window.addEventListener("pageshow", onPageShow);
    reducedMotion.addEventListener("change", onMotionPreferenceChange);
    document.fonts?.ready
      .then(() => {
        if (!disposed) requestMeasure();
      })
      .catch(() => undefined);

    applyMotionPreference();

    return () => {
      disposed = true;
      detachScrollListener();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", onResize);
      visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pageshow", onPageShow);
      reducedMotion.removeEventListener("change", onMotionPreferenceChange);
      resetWrittenStyles();
      resetManagedInert();
      root.classList.remove("journey-motion-ready");
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
