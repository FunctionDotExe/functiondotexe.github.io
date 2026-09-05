/** Small, deterministic crystal meshes. All six studies share a topology for morphing. */
export type Vec3 = readonly [number, number, number];

export const CRYSTAL_CAMERA: Vec3 = [0, -.11, 5.5];

export interface CrystalGeometry {
  positions: Float32Array;
  normals: Float32Array;
  barycentrics: Float32Array;
  edgeMasks: Float32Array;
  facets: Float32Array;
  vertexCount: number;
}

export const CRYSTAL_PALETTES: readonly { cool: Vec3; warm: Vec3; shadow: Vec3 }[] = [
  { cool: [.34, .59, .90], warm: [1, .79, .59], shadow: [.07, .105, .25] },
  { cool: [.60, .43, .87], warm: [1, .72, .66], shadow: [.12, .065, .25] },
  { cool: [.28, .69, .70], warm: [.96, .86, .66], shadow: [.055, .14, .22] },
  { cool: [.81, .47, .38], warm: [1, .87, .61], shadow: [.18, .085, .23] },
  { cool: [.43, .71, .91], warm: [.88, .93, 1], shadow: [.07, .14, .29] },
  { cool: [.66, .55, .89], warm: [1, .76, .57], shadow: [.115, .09, .27] },
];

export function crystalIndex(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(5, Math.round(value))) : 0;
}

/** Recompute flat normals after a morph so specular light follows the actual faces. */
export function updateCrystalNormals(positions: Float32Array, normals: Float32Array): void {
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i + 3] - positions[i];
    const ay = positions[i + 4] - positions[i + 1];
    const az = positions[i + 5] - positions[i + 2];
    const bx = positions[i + 6] - positions[i];
    const by = positions[i + 7] - positions[i + 1];
    const bz = positions[i + 8] - positions[i + 2];
    const nx = ay * bz - az * by;
    const ny = az * bx - ax * bz;
    const nz = ax * by - ay * bx;
    const length = Math.hypot(nx, ny, nz) || 1;
    for (let j = 0; j < 9; j += 3) {
      normals[i + j] = nx / length;
      normals[i + j + 1] = ny / length;
      normals[i + j + 2] = nz / length;
    }
  }
}

/** Returns the largest remaining difference; callers stop scheduling when settled. */
export function approachCrystalValues(current: Float32Array, target: ArrayLike<number>, amount: number): number {
  let remaining = 0;
  for (let i = 0; i < current.length; i++) {
    const delta = target[i] - current[i];
    current[i] = Math.abs(delta) < .00008 ? target[i] : current[i] + delta * amount;
    remaining = Math.max(remaining, Math.abs(target[i] - current[i]));
  }
  return remaining;
}

export function crystalProjection(aspect: number): Float32Array {
  // Widen the lens on a narrow viewport, keeping the whole specimen in frame.
  const fit = Math.min(1, Math.max(.1, aspect) / .9);
  // This lens fits the tallest study through a full turn and leaves room for
  // controls beneath the specimen, including in the shortest 330px stage.
  const f = 3.0 * fit;
  const near = .1;
  const far = 30;
  return new Float32Array([
    f / Math.max(.1, aspect), 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, 2 * far * near / (near - far), 0,
  ]);
}

export function createCrystalGeometry(study: number): CrystalGeometry {
  const variant = crystalIndex(study);
  const positions: number[] = [];
  const barycentrics: number[] = [];
  const edgeMasks: number[] = [];
  const facets: number[] = [];

  const triangle = (a: Vec3, b: Vec3, c: Vec3, facet: number, mask: Vec3 = [1, 1, 1]) => {
    positions.push(...a, ...b, ...c);
    barycentrics.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
    edgeMasks.push(...mask, ...mask, ...mask);
    facets.push(facet, facet, facet);
  };

  // x, z, height, radius, outward lean, forward lean, rotation around the long axis.
  const spires = [
    [-.12, -.06, 2.30, .34, -.055, -.035, .12],
    [-.51, .02, 1.65, .27, -.29, .04, .24],
    [.46, .00, 1.61, .25, .24, -.07, -.13],
    [.26, -.39, 1.94, .27, .09, -.17, .38],
    [-.10, .43, 1.18, .29, -.02, .21, -.10],
    [-.54, .31, .97, .235, -.40, .17, .32],
    [.57, .30, 1.05, .24, .38, .16, .00],
  ];
  const heightScale = [1, 1.06, .90, .98, 1.03, .95][variant];
  const widthScale = [1, .92, 1.10, .97, .96, 1.05][variant];

  spires.forEach(([offsetX, offsetZ, originalHeight, originalRadius, leanX, leanZ, rotation], crystal) => {
    const variation = Math.sin(crystal * 1.71 + variant * .92) * .075;
    const height = originalHeight * heightScale * (1 + variation);
    const radius = originalRadius * widthScale;
    const tx = leanX * (1 + variant * .045);
    const tz = leanZ + Math.sin(variant * .9 + crystal) * .025;
    const transform = (x: number, y: number, z: number): Vec3 => {
      const tiltedX = x * Math.cos(tx) + y * Math.sin(tx);
      const tiltedY = y * Math.cos(tx) - x * Math.sin(tx);
      return [
        tiltedX + offsetX,
        tiltedY * Math.cos(tz) - z * Math.sin(tz) - 1.03,
        tiltedY * Math.sin(tz) + z * Math.cos(tz) + offsetZ,
      ];
    };
    const bottom: Vec3[] = [];
    const shoulder: Vec3[] = [];
    for (let side = 0; side < 6; side++) {
      const angle = side * Math.PI / 3 + rotation;
      bottom.push(transform(Math.cos(angle) * radius * .77, -.06, Math.sin(angle) * radius * .77));
      shoulder.push(transform(Math.cos(angle) * radius, height * .72, Math.sin(angle) * radius));
    }
    const apex = transform(radius * .09, height, -radius * .075);
    const foot = transform(0, -.06, 0);
    for (let side = 0; side < 6; side++) {
      const next = (side + 1) % 6;
      const facet = (crystal * 7 + side * 3) % 13 / 12;
      triangle(bottom[side], shoulder[next], bottom[next], facet, [1, 1, 0]);
      triangle(bottom[side], shoulder[side], shoulder[next], facet, [1, 0, 1]);
      triangle(shoulder[side], apex, shoulder[next], .25 + facet * .7);
      triangle(bottom[side], bottom[next], foot, .1);
    }
  });

  // A compact broken matrix gives the spires a believable shared origin.
  const rim: Vec3[] = [];
  const foot: Vec3[] = [];
  for (let side = 0; side < 9; side++) {
    const angle = side / 9 * Math.PI * 2;
    const radius = .89 + Math.sin(side * 2.3) * .055;
    rim.push([Math.cos(angle) * radius, -1.04 + Math.sin(side * 1.1) * .035, Math.sin(angle) * radius * .66]);
    foot.push([Math.cos(angle) * radius * .85, -1.20, Math.sin(angle) * radius * .57]);
  }
  const top: Vec3 = [.03, -.84, 0];
  for (let side = 0; side < 9; side++) {
    const next = (side + 1) % 9;
    triangle(rim[side], top, rim[next], .05);
    triangle(foot[side], rim[next], foot[next], .02, [1, 1, 0]);
    triangle(foot[side], rim[side], rim[next], .02, [1, 0, 1]);
    triangle(foot[side], foot[next], [0, -1.20, 0], .02);
  }

  const positionArray = new Float32Array(positions);
  const normals = new Float32Array(positions.length);
  updateCrystalNormals(positionArray, normals);
  return {
    positions: positionArray,
    normals,
    barycentrics: new Float32Array(barycentrics),
    edgeMasks: new Float32Array(edgeMasks),
    facets: new Float32Array(facets),
    vertexCount: positions.length / 3,
  };
}
