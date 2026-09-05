/** Continuous specimen turns, with each integer marking the next skill field. */
export function skillScrollProgress(y: number, stops: readonly number[], end: number): number {
  if (!Number.isFinite(y) || !stops.length || y <= stops[0]) return 0;
  for (let index = 0; index < stops.length; index++) {
    const next = index + 1 < stops.length ? stops[index + 1] : end;
    if (y < next) return index + Math.max(0, Math.min(1, (y - stops[index]) / Math.max(1, next - stops[index])));
  }
  return stops.length;
}
