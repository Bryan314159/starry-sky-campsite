import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Darker scorched ring on the ground around the campfire.
 *
 * Soft circular dark patch (transparent radial gradient on a plane)
 * — implies long campfire use without showing literal scorch marks
 * (which would clash with the toon-shaded "无影" aesthetic).
 */
function createScorchTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Outer soft ring
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, size * 0.32,
    size / 2, size / 2, size * 0.5,
  );
  grad.addColorStop(0, 'rgba(85, 65, 40, 0)');
  grad.addColorStop(0.5, 'rgba(85, 65, 40, 0.32)');
  grad.addColorStop(1, 'rgba(85, 65, 40, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Inner subtle warmth
  const warm = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size * 0.3,
  );
  warm.addColorStop(0, 'rgba(120, 80, 40, 0.18)');
  warm.addColorStop(1, 'rgba(120, 80, 40, 0)');
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function ScorchMark() {
  const tex = useMemo(() => createScorchTexture(), []);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.025, 1.5]}
      raycast={() => null}
    >
      <planeGeometry args={[1.6, 1.6]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        opacity={0.9}
      />
    </mesh>
  );
}
