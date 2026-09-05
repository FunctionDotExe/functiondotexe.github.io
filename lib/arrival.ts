// Runs before the first paint so server-rendered text never flashes and then
// disappears. The watchdog restores the page even if hydration never arrives.
export const ARRIVAL_BOOTSTRAP = `
(() => {
  try {
    const navigation = performance.getEntriesByType("navigation")[0];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (location.hash && location.hash !== "#entry") ||
        navigation?.type === "back_forward" || scrollY > 48) return;
    document.documentElement.dataset.arrival = "boot";
    setTimeout(() => {
      if (document.documentElement.dataset.arrival === "boot") {
        delete document.documentElement.dataset.arrival;
      }
    }, 1400);
  } catch {}
})();
`;
