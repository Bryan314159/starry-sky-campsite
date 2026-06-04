import { useMemo } from 'react';
import Star from './Star';

/**
 * Deterministic pseudo-random based on a seed string.
 * Same seed always produces the same sequence.
 */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export default function StarField({ bookmarks, onHoverChange }) {
  const stars = useMemo(() => {
    if (!bookmarks || bookmarks.length === 0) return [];

    return bookmarks.map((bookmark, i) => {
      const seed = `${bookmark.id}-${i}`;
      const r1 = seededRandom(seed);
      const r2 = seededRandom(seed + 'y');
      const r3 = seededRandom(seed + 'z');
      const r4 = seededRandom(seed + 's');

      // Distribute stars in a frustum-friendly space:
      // camera at (0, 0.2, 0.5) looking at (0, 8, -5)
      // place stars in upper hemisphere view, distance 4-9
      const azimuth = r1 * Math.PI * 2; // 0-360° horizontal
      // Elevation 25-80° from camera position
      const elevation = r2 * Math.PI * 0.4 + 0.45; // ~25°-90°
      const radius = 4 + r3 * 5; // 4-9

      const x = radius * Math.cos(elevation) * Math.sin(azimuth);
      const y = radius * Math.sin(elevation) + 0.2; // camera y offset
      const z = radius * Math.cos(elevation) * Math.cos(azimuth);

      // Size
      const size = 0.08 + r4 * 0.16;

      return {
        key: bookmark.id,
        bookmark,
        position: [x, y, z],
        size,
      };
    });
  }, [bookmarks]);

  return (
    <group>
      {stars.map((star) => (
        <Star
          key={star.key}
          bookmark={star.bookmark}
          position={star.position}
          size={star.size}
          onHoverChange={onHoverChange}
        />
      ))}
    </group>
  );
}
