import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Layered grass plane with hand-painted watercolor texture.
 *
 * Layer 1 (main, toon material): warm sage-green base
 * Layer 2 (texture overlay):     darker green brush strokes + cream wildflower dots
 *   - low-saturation, no sharp edges
 *   - brushed into the canvas with low opacity
 *
 * The result reads as "shaded meadow" rather than flat color,
 * while staying toon-shaded (no per-pixel lighting on the texture).
 */
function createGrassTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base — matches the main material color
  ctx.fillStyle = '#7a9f5a';
  ctx.fillRect(0, 0, size, size);

  // Darker grass brush strokes — clusters of vertical strokes
  ctx.strokeStyle = 'rgba(74, 107, 63, 0.55)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 6 + Math.random() * 14;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - len);
    ctx.stroke();
  }

  // Lighter grass tufts
  ctx.strokeStyle = 'rgba(156, 188, 120, 0.5)';
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 5 + Math.random() * 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y - len);
    ctx.stroke();
  }

  // Wildflower dots — cream / white (small)
  ctx.fillStyle = 'rgba(245, 234, 211, 0.95)';
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 2 + Math.random() * 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tiny ochre dots — like fallen petals / dirt
  ctx.fillStyle = 'rgba(212, 161, 85, 0.6)';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1.5 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft sage patches — broader, lower-opacity
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 40 + Math.random() * 70;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(122, 159, 90, 0.4)');
    grad.addColorStop(1, 'rgba(122, 159, 90, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  tex.needsUpdate = true;
  return tex;
}

export default function Ground() {
  const grassMap = useMemo(() => createGrassTexture(), []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      raycast={() => null}
    >
      <planeGeometry args={[14, 22]} />
      <meshToonMaterial map={grassMap} color="#9bbf73" />
    </mesh>
  );
}
