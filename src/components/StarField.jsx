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

      // Spherical distribution in upper hemisphere (elevation 15°-90°)
      const azimuth = r1 * Math.PI * 2;
      const elevation = r2 * Math.PI * 0.42 + 0.25; // ~14° to 90°
      const radius = 16 + r3 * 2;

      const x = radius * Math.cos(elevation) * Math.sin(azimuth);
      const y = radius * Math.sin(elevation);
      const z = radius * Math.cos(elevation) * Math.cos(azimuth);

      // Size: mostly small, few large (natural distribution)
      const size = 0.06 + r4 * 0.14;

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
