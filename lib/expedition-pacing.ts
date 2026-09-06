export type ExpeditionStop = { id: string; label: string; scene: string; y: number; duration: number };
export type ExpeditionHold = { stop: ExpeditionStop; direction: number; startedAt: number | null };

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** Input-independent gates. Only an intentional movement can approach a stop. */
export class ExpeditionPacing {
  position: number;
  target: number;
  hold: ExpeditionHold | null = null;
  readonly stops: ExpeditionStop[];
  private lastTime: number | null = null;
  private recentIntent: { delta: number; at: number } | null = null;

  constructor(stops: readonly ExpeditionStop[], position: number, public limit: number) {
    this.limit = Math.max(0, Number.isFinite(limit) ? limit : 0);
    this.position = this.target = clamp(Number.isFinite(position) ? position : 0, 0, this.limit);
    this.stops = stops.filter((stop) => Number.isFinite(stop.y)).map((stop) => ({
      ...stop,
      y: clamp(stop.y, 0, this.limit),
      duration: clamp(Number.isFinite(stop.duration) ? stop.duration : 2000, 500, 4000),
    })).sort((a, b) => a.y - b.y).filter((stop, index, sorted) => index === 0 || stop.y - sorted[index - 1].y > 2);
  }

  reset(position: number) {
    this.position = this.target = clamp(Number.isFinite(position) ? position : 0, 0, this.limit);
    this.hold = null;
    this.recentIntent = null;
    this.lastTime = null;
  }

  input(delta: number, now: number) {
    if (!Number.isFinite(delta) || !Number.isFinite(now) || Math.abs(delta) < .01) return;
    delta = clamp(delta, -1400, 1400);
    const direction = Math.sign(delta);
    if (this.hold) {
      if (direction === this.hold.direction) {
        // Replace, never accumulate: a fast gesture cannot queue the whole tour.
        this.recentIntent = { delta, at: now };
        return;
      }
      // Reversing is always an exit, including while approaching a gate.
      this.reset(this.position);
    }
    if ((this.target - this.position) * direction < 0) this.target = this.position;
    const desired = clamp(this.target + delta, 0, this.limit);
    const candidates = this.stops.filter((stop) => direction > 0
      ? stop.y > this.target + .001 && stop.y <= desired
      : stop.y < this.target - .001 && stop.y >= desired);
    const stop = direction > 0 ? candidates[0] : candidates[candidates.length - 1];
    this.target = stop ? stop.y : desired;
    if (stop) this.hold = { stop, direction, startedAt: null };
  }

  tick(now: number) {
    if (!Number.isFinite(now)) return this.position;
    const elapsed = this.lastTime === null ? 16 : clamp(now - this.lastTime, 0, 48);
    this.lastTime = now;
    if (this.hold && this.hold.startedAt !== null && now - this.hold.startedAt >= this.hold.stop.duration) {
      const intent = this.recentIntent;
      this.hold = null;
      this.recentIntent = null;
      // Continue only a gesture still being made as the brief hold ends.
      if (intent && now - intent.at <= 240) this.input(intent.delta, now);
    }
    this.position += (this.target - this.position) * (1 - Math.exp(-elapsed / 65));
    if (Math.abs(this.target - this.position) < .5) this.position = this.target;
    if (this.hold && this.hold.startedAt === null && this.position === this.target) this.hold.startedAt = now;
    return this.position;
  }

  get moving() { return Math.abs(this.target - this.position) > .01 || this.hold !== null; }

  currentStop() {
    if (this.hold) return this.hold.stop;
    let current = this.stops[0];
    this.stops.forEach((stop) => { if (stop.y <= this.position + 1) current = stop; });
    return current;
  }

  holdProgress(now: number) {
    return this.hold?.startedAt == null ? 0 : clamp((now - this.hold.startedAt) / this.hold.stop.duration, 0, 1);
  }

  skipTarget() {
    const current = this.currentStop();
    if (!current) return this.limit;
    const index = this.stops.indexOf(current);
    return this.stops.slice(index + 1).find((stop) => stop.scene !== current.scene)?.y ?? this.limit;
  }
}
