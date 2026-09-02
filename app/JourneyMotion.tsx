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
  zoom: number;
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
      zoom: mix(previous.zoom, next.zoom, amount),
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
    const surfaceChapterElement = document.querySelector<HTMLElement>(
      '[data-journey-chapter="surface"]',
    );
    const depthChapterElement = document.querySelector<HTMLElement>(
      '[data-journey-chapter="depth"]',
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
    let previousScrollY = window.scrollY;
    let scrollVelocity = 0;
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
      const viewportHeight = Math.max(window.innerHeight, 1);
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

    const depthHandoffAt = (scrollY: number, viewportHeight: number) => {
      if (!depthChapter) return 0;
      return smoothstep(
        depthChapter.top,
        depthChapter.top + viewportHeight * 0.92,
        scrollY,
      );
    };

    const writeRootWorld = (
      surfaceProgress: number,
      motionScale: number,
      depthHandoff: number,
    ) => {
      const centered = surfaceProgress - 0.5;
      const exit = smoothstep(0.03, 0.96, depthHandoff);
      const depthOffset = (distance: number, exitDistance: number) =>
        `${(
          -centered * distance * motionScale -
          exit * exitDistance * motionScale
        ).toFixed(2)}px`;

      writeStyle(root, "--world-sky-y", depthOffset(14, 22));
      writeStyle(root, "--world-clouds-y", depthOffset(42, 56));
      writeStyle(
        root,
        "--world-clouds-x",
        `${((centered * 16 - exit * 26) * motionScale).toFixed(2)}px`,
      );
      writeStyle(root, "--world-valley-y", depthOffset(74, 92));
      writeStyle(root, "--world-trail-y", depthOffset(116, 148));
      writeStyle(root, "--world-foreground-y", depthOffset(168, 224));
      writeStyle(
        root,
        "--world-trail-x",
        `${(exit * 28 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--world-foreground-x",
        `${(exit * 58 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--world-scale",
        (
          1.055 +
          surfaceProgress * 0.012 * motionScale +
          exit * 0.045 * motionScale
        ).toFixed(4),
      );
    };

    const depthCameraShots = (viewportHeight: number): CameraShot[] => {
      if (!depthChapter) {
        return [{ at: 0, y: 0, x: 0, zoom: 1 }];
      }

      const chapterEnd =
        depthChapter.top + Math.max(depthChapter.height - viewportHeight, 1);
      const transitionEnd = depthChapter.top + viewportHeight * 0.92;
      const targetY = [0, 0.22, 0.48, 0.74, 1];
      const targetX = [0, 0.058, -0.064, 0.072, 0];
      const targetZoom = [1.018, 1.006, 1.024, 1.012, 1.042];

      const shots = targetY.map((y, index) => {
        if (index === 0) {
          return { at: transitionEnd, y, x: targetX[index], zoom: targetZoom[index] };
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
          zoom: targetZoom[index],
        };
      });

      for (let index = 1; index < shots.length; index += 1) {
        shots[index].at = Math.max(shots[index].at, shots[index - 1].at + 1);
      }

      return shots;
    };

    const writeDepthWorld = (
      scrollY: number,
      motionScale: number,
      viewportHeight: number,
      viewportWidth: number,
    ) => {
      const handoff = depthHandoffAt(scrollY, viewportHeight);
      const portalRelease = depthChapter
        ? smoothstep(
            depthChapter.top + viewportHeight * 0.9,
            depthChapter.top + viewportHeight * 1.45,
            scrollY,
          )
        : 0;
      const portalScale = Math.max(
        0.001,
        handoff * 5.25 + portalRelease * 3.75,
      );
      const isPortraitPortal =
        viewportWidth <= 820 && viewportHeight > viewportWidth;
      const portalRadius =
        portalScale * Math.min(viewportWidth, viewportHeight) * 0.255 +
        (isPortraitPortal
          ? smoothstep(0.34, 0.54, handoff) * viewportHeight * 0.032
          : 0);
      const shot = sampleCameraShots(depthCameraShots(viewportHeight), scrollY);
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

      writeStyle(root, "--depth-reveal-radius", `${portalRadius.toFixed(2)}px`);
      writeStyle(root, "--depth-portal-scale", portalScale.toFixed(4));
      writeStyle(
        root,
        "--depth-portal-opacity",
        (1 - smoothstep(0.64, 1, portalRelease)).toFixed(4),
      );
      writeStyle(root, "--depth-zoom", shot.zoom.toFixed(4));
      writeStyle(
        root,
        "--climb-hud-opacity",
        (1 - smoothstep(0.02, 0.22, handoff)).toFixed(4),
      );
      writeStyle(
        root,
        "--threshold-copy-opacity",
        smoothstep(0.28, 0.7, handoff).toFixed(4),
      );
      writeStyle(
        root,
        "--threshold-copy-y",
        `${((1 - handoff) * 46 * motionScale).toFixed(2)}px`,
      );

      for (const plane of DEPTH_PLANES) {
        const factor = planeFactors[plane];
        const x = -shot.x * viewportWidth * factor * motionScale;
        const y = -depthTravels[plane] * shot.y - depthPulse * factor;
        writeStyle(root, `--depth-${plane}-x`, `${x.toFixed(2)}px`);
        writeStyle(root, `--depth-${plane}-y`, `${y.toFixed(2)}px`);
      }

      writeStyle(
        root,
        "--depth-atmosphere-opacity",
        (0.42 + deepHeat * 0.2).toFixed(3),
      );
      writeStyle(
        root,
        "--depth-shade-opacity",
        (0.07 + deepHeat * 0.11).toFixed(3),
      );
    };

    const writeBasecampMotion = (
      progress: number,
      motionScale: number,
      writeLocally: boolean,
    ) => {
      const copyExit = smoothstep(0.52, 0.7, progress);
      const values = {
        "--basecamp-progress": progress.toFixed(4),
        "--basecamp-copy-opacity": (1 - copyExit).toFixed(4),
        "--basecamp-copy-y": `${(-copyExit * 64 * motionScale).toFixed(2)}px`,
      };

      for (const [property, value] of Object.entries(values)) {
        writeStyle(root, property, value);
        if (writeLocally && basecamp) writeStyle(basecamp.element, property, value);
      }

      if (basecamp) writeSceneInteractivity(basecamp.element, copyExit <= 0.94);
    };

    const writeMotion = (scrollY: number, worldScrollY: number) => {
      const {
        height: viewportHeight,
        width: viewportWidth,
        pageRange,
        motionScale,
      } = metrics;
      const depthUsesNormalFlow =
        viewportHeight <= 600 && viewportWidth > viewportHeight;
      const pageProgress = clamp(scrollY / pageRange);
      const basecampProgress = enteringProgress(basecamp, worldScrollY, viewportHeight);
      const climbProgress = sectionProgress(climb, worldScrollY, viewportHeight);
      const surfaceProgress = sectionProgress(
        surfaceChapter,
        worldScrollY,
        viewportHeight,
      );
      const depthHandoff = depthHandoffAt(worldScrollY, viewportHeight);

      writeStyle(root, "--journey-progress", pageProgress.toFixed(4));
      writeRootWorld(surfaceProgress, motionScale, depthHandoff);
      writeDepthWorld(
        worldScrollY,
        motionScale,
        viewportHeight,
        viewportWidth,
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

      const basecampIsNear = Boolean(
        basecamp && isNearViewport(basecamp, scrollY, viewportHeight),
      );
      // JourneyWorld inherits these values from root. Mirroring them locally
      // preserves the existing section-level variable API.
      writeBasecampMotion(basecampProgress, motionScale, basecampIsNear);

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

        scene.element.classList.toggle("journey-scene--active", isActive);

        if (!isNearViewport(scene, scrollY, viewportHeight)) {
          writeStyle(
            scene.element,
            "--scene-focus",
            isNormalFlowDepthScene ? "1" : "0",
          );
          writeStyle(scene.element, "--scene-tint-opacity", "0");
          writeSceneInteractivity(scene.element, isNormalFlowDepthScene);
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
          isNormalFlowDepthScene || isActive,
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
          previousScrollY = scrollY;
        }
      }

      const elapsed = clamp(time - lastFrameTime, 8, 48);
      const instantVelocity = (scrollY - previousScrollY) / elapsed;
      const velocityFollow = 1 - Math.exp(-elapsed / 58);
      scrollVelocity += (instantVelocity - scrollVelocity) * velocityFollow;
      previousScrollY = scrollY;

      const lookAhead = clamp(
        scrollVelocity * 30 * metrics.motionScale,
        -36 * metrics.motionScale,
        36 * metrics.motionScale,
      );
      const cameraTarget = clamp(scrollY + lookAhead, 0, metrics.pageRange);
      const cameraFollow = 1 - Math.exp(-elapsed / 92);
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
      const velocityIsSettling = Math.abs(scrollVelocity) > 0.002;
      if (cameraIsSettling || velocityIsSettling) scheduleUpdate();
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
        previousScrollY = window.scrollY;
        scrollVelocity = 0;
        hasRenderedFrame = false;
        return;
      }

      attachScrollListener();
      needsMeasure = true;
      cameraScrollY = window.scrollY;
      previousScrollY = window.scrollY;
      scrollVelocity = 0;
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
