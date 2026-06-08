import * as THREE from 'three';

/**
 * 3-step toon gradient map for MeshToonMaterial.
 *
 * MeshToonMaterial in Three.js shades surfaces by reading the red channel
 * of `gradientMap` (a 1D texture) and snapping to the nearest pixel.
 * A 3-pixel texture with NearestFilter therefore gives a flat
 * "shadow / midtone / highlight" 3-step ramp — the signature "罗小黑战记"
 * flat-shaded toon look from art-style.md §3.1.
 *
 * Pixel values [60, 160, 240] map to:
 *   shadow    ≈ 24% brightness (deep warm shadow)
 *   midtone   ≈ 63% brightness (body color)
 *   highlight ≈ 94% brightness (warm rim)
 *
 * Singleton — share across all meshToonMaterial instances. The DataTexture
 * is reference-shared, so adding the same instance to dozens of materials
 * costs zero extra GPU memory.
 *
 * Usage:
 *   import { TOON_GRADIENT_MAP } from '../utils/toonGradientMap';
 *   <meshToonMaterial color="#b58560" gradientMap={TOON_GRADIENT_MAP} />
 *
 * Task: 2.15 — 全场景 MeshToonMaterial + 3 阶 gradientMap + NearestFilter
 */
function createToonGradientMap() {
  const data = new Uint8Array([60, 160, 240]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const TOON_GRADIENT_MAP = createToonGradientMap();
