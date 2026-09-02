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

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (start: number, end: number, value: number) => {
  const progress = clamp((value - start) / Math.max(end - start, Number.EPSILON));
  return progress * progress * (3 - 2 * progress);
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
    const depthBackPlate = document.querySelector<HTMLImageElement>(
      ".journey-world__depth-layer--back .journey-world__depth-plate",
    );
    const sceneElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-journey-scene]"),
    );

    let hero: MeasuredScene | null = null;
    let basecamp: MeasuredScene | null = null;
    let climb: MeasuredScene | null = null;
    let surfaceChapter: MeasuredScene | null = null;
    let depthChapter: MeasuredScene | null = null;
    let depthTravel = Math.max(window.innerHeight, 1);
    let scenes: MeasuredScene[] = [];
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
      depthTravel = Math.max(
        (depthBackPlate?.getBoundingClientRect().height ?? viewportHeight * 2) -
          viewportHeight,
        viewportHeight * 0.65,
      );
      scenes = sceneElements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, top: rect.top + scrollY, height: rect.height };
      });
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

    const writeRootWorld = (
      surfaceProgress: number,
      motionScale: number,
    ) => {
      const centered = surfaceProgress - 0.5;
      const depthOffset = (distance: number) =>
        `${(-centered * distance * motionScale).toFixed(2)}px`;

      writeStyle(
        root,
        "--world-sky-y",
        depthOffset(14),
      );
      writeStyle(
        root,
        "--world-clouds-y",
        depthOffset(42),
      );
      writeStyle(
        root,
        "--world-clouds-x",
        `${(centered * 16 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--world-valley-y",
        depthOffset(74),
      );
      writeStyle(
        root,
        "--world-trail-y",
        depthOffset(116),
      );
      writeStyle(
        root,
        "--world-foreground-y",
        depthOffset(168),
      );
      writeStyle(
        root,
        "--world-scale",
        (1.055 + surfaceProgress * 0.012 * motionScale).toFixed(4),
      );
    };

    const writeDepthWorld = (
      progress: number,
      motionScale: number,
      viewportHeight: number,
    ) => {
      // The two realms meet at the same moving edge. There is no dissolve:
      // the mountain physically leaves through the top while the cave enters
      // from directly beneath it, with the cave roof overlapping the seam.
      const handoff = smoothstep(0, 0.075, progress);
      const plateProgress = clamp((progress - 0.075) / 0.925);
      const cameraY = -depthTravel * plateProgress;
      const surfaceRealmY = -handoff * viewportHeight;
      const seamArc = Math.sin(handoff * Math.PI);
      const seamDepth = seamArc * Math.min(viewportHeight * 0.065, 72);
      const seamOverlap = seamArc * viewportHeight * 0.1;
      const depthRealmY = (1 - handoff) * viewportHeight - seamOverlap;
      const focusX = 53 - smoothstep(0.08, 0.96, plateProgress) * 3;
      const deepHeat = smoothstep(0.48, 0.92, plateProgress);

      writeStyle(root, "--surface-realm-y", `${surfaceRealmY.toFixed(2)}px`);
      writeStyle(root, "--depth-realm-y", `${depthRealmY.toFixed(2)}px`);
      writeStyle(root, "--depth-seam-a", `${(seamDepth * 0.36).toFixed(2)}px`);
      writeStyle(root, "--depth-seam-b", `${(seamDepth * 0.92).toFixed(2)}px`);
      writeStyle(root, "--depth-seam-c", `${(seamDepth * 0.54).toFixed(2)}px`);
      writeStyle(root, "--depth-seam-d", `${(seamDepth * 0.78).toFixed(2)}px`);
      writeStyle(
        root,
        "--climb-hud-opacity",
        (1 - smoothstep(0, 0.015, progress)).toFixed(4),
      );
      writeStyle(root, "--depth-back-y", `${cameraY.toFixed(2)}px`);
      writeStyle(
        root,
        "--depth-atmosphere-y",
        `${(cameraY - plateProgress * 42 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--depth-atmosphere-x",
        `${(-plateProgress * 18 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--depth-mid-y",
        `${(cameraY - plateProgress * 108 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--depth-mid-x",
        `${(plateProgress * 10 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--depth-near-y",
        `${(cameraY - plateProgress * 184 * motionScale).toFixed(2)}px`,
      );
      writeStyle(
        root,
        "--depth-near-x",
        `${(plateProgress * 22 * motionScale).toFixed(2)}px`,
      );
      writeStyle(root, "--depth-focus-x", `${focusX.toFixed(3)}%`);
      writeStyle(
        root,
        "--depth-atmosphere-opacity",
        (0.16 + plateProgress * 0.08 + deepHeat * 0.1).toFixed(3),
      );
      writeStyle(
        root,
        "--depth-shade-opacity",
        (0.14 + deepHeat * 0.22).toFixed(3),
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

    const writeMotion = (scrollY: number) => {
      const {
        height: viewportHeight,
        width: viewportWidth,
        pageRange,
        motionScale,
      } = metrics;
      const depthUsesNormalFlow =
        viewportHeight <= 600 && viewportWidth > viewportHeight;
      const pageProgress = clamp(scrollY / pageRange);
      const basecampProgress = enteringProgress(basecamp, scrollY, viewportHeight);
      const climbProgress = sectionProgress(climb, scrollY, viewportHeight);
      const surfaceProgress = sectionProgress(surfaceChapter, scrollY, viewportHeight);
      const depthProgress = sectionProgress(depthChapter, scrollY, viewportHeight);

      writeStyle(root, "--journey-progress", pageProgress.toFixed(4));
      writeRootWorld(surfaceProgress, motionScale);
      writeDepthWorld(depthProgress, motionScale, viewportHeight);

      if (hero && isNearViewport(hero, scrollY, viewportHeight)) {
        const progress = clamp(
          (scrollY - hero.top) /
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

      if (climb && isNearViewport(climb, scrollY, viewportHeight)) {
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

    const runFrame = () => {
      animationFrame = 0;
      if (disposed || motionIsReduced) return;

      const scrollY = window.scrollY;
      if (needsMeasure) readMeasurements(scrollY);
      writeMotion(scrollY);

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
        return;
      }

      attachScrollListener();
      needsMeasure = true;
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
