import { describe, it, expect } from 'vitest';

/**
 * SP3.2: Star positions must be deterministic — same bookmark IDs
 * produce the same coordinates every time.
 *
 * We replicate the seeded random logic from StarField to test it directly.
 */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function generateStarPosition(bookmarkId, index) {
  const seed = `${bookmarkId}-${index}`;
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 'y');
  const r3 = seededRandom(seed + 'z');
  const r4 = seededRandom(seed + 's');

  const azimuth = r1 * Math.PI * 2;
  const elevation = r2 * Math.PI * 0.42 + 0.25;
  const radius = 16 + r3 * 2;

  return {
    x: radius * Math.cos(elevation) * Math.sin(azimuth),
    y: radius * Math.sin(elevation),
    z: radius * Math.cos(elevation) * Math.cos(azimuth),
    size: 0.06 + r4 * 0.14,
  };
}

describe('Star position generation (SP3.2)', () => {
  it('same bookmark produces same position every time', () => {
    const a = generateStarPosition('b1', 0);
    const b = generateStarPosition('b1', 0);
    expect(a).toEqual(b);
  });

  it('different bookmarks produce different positions', () => {
    const a = generateStarPosition('b1', 0);
    const b = generateStarPosition('b2', 0);
    const same =
      a.x === b.x && a.y === b.y && a.z === b.z;
    expect(same).toBe(false);
  });

  it('stars stay in upper hemisphere (y > 0)', () => {
    for (let i = 0; i < 50; i++) {
      const pos = generateStarPosition(`bookmark-${i}`, i);
      expect(pos.y).toBeGreaterThan(0);
    }
  });

  it('star size is within expected range', () => {
    for (let i = 0; i < 50; i++) {
      const pos = generateStarPosition(`bookmark-${i}`, i);
      expect(pos.size).toBeGreaterThanOrEqual(0.06);
      expect(pos.size).toBeLessThanOrEqual(0.20);
    }
  });

  it('star distance from origin is reasonable', () => {
    for (let i = 0; i < 20; i++) {
      const pos = generateStarPosition(`b-${i}`, i);
      const dist = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
      expect(dist).toBeGreaterThanOrEqual(16);
      expect(dist).toBeLessThanOrEqual(18);
    }
  });
});
