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
 * Pixel values [110, 180, 245] map to (Task 2.25 调整):
 *   shadow    ≈ 43% brightness (warm shadow — not pitch black)
 *   midtone   ≈ 71% brightness (body color)
 *   highlight ≈ 96% brightness (warm rim)
 *
 * 原值 [60, 160, 240] 的暗面 24% 太深，导致 toon 材质在 ambient 弱时
 * 背面纯黑，2.25 视觉回归中观察到。提升暗面到 43% 保留 toon 阶感
 * 同时避免"暗面死黑"。
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
  const data = new Uint8Array([110, 180, 245]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const TOON_GRADIENT_MAP = createToonGradientMap();
