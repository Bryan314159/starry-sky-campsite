import { useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Load a background image as a Three.js texture.
 *
 * Task 2.22 — useBackgroundImage
 *
 * Behavior:
 *   - Load image via THREE.TextureLoader
 *   - On success: return ready Texture with sRGBColorSpace
 *   - On error: return null texture + error object → caller renders fallback
 *   - On src change: cancel previous load, start new one
 *   - Cleanup on unmount: mark cancelled so any in-flight load is ignored
 *
 * Used by BackgroundImage.jsx; the source URL comes from AppContext.bgImage
 * (default: /scenes/campsite-bg.webp), which is set by the popup image
 * picker (task 2.24) and persisted to chrome.storage.local.
 */
export function useBackgroundImage(src) {
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setTexture(null);

    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        if (cancelled) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setTexture(tex);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        if (cancelled) return;
        // SP1.1.1 — graceful degradation: warn but don't crash
        console.warn(
          '[BackgroundImage] Failed to load image:',
          src,
          err?.message || err,
        );
        setError(err);
        setIsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [src]);

  return { texture, error, isLoading };
}
