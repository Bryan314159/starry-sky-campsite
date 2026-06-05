import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Distant background composition for the campsite scene.
 * Stacked far-to-near, all unlit (MeshBasicMaterial) so they read as
 * atmospheric perspective layers:
 *
 *   Layer 1 — Distant mountains (silhouette band, dark teal)
 *   Layer 2 — Lake/water (muted blue-gray plane, low to ground)
 *   Layer 3 — Mist band (semi-transparent white, hand-painted via canvas)
 *
 * All layers sit BEHIND the signpost in z-order — positioned at z < 0
 * and use raycast={null} so they never steal clicks.
 */

function createMistTexture() {
  const w = 1024;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Transparent base
  ctx.clearRect(0, 0, w, h);

  // Soft horizontal cloud bands — varying opacity
  for (let i = 0; i < 18; i++) {
    const y = Math.random() * h;
    const x = Math.random() * w;
    const rx = 120 + Math.random() * 280;
    const ry = 18 + Math.random() * 36;
    const alpha = 0.08 + Math.random() * 0.18;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    grad.addColorStop(0, `rgba(255, 248, 232, ${alpha})`);
    grad.addColorStop(1, 'rgba(255, 248, 232, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function DistantMountains() {
  // Silhouette of rolling hills — flat color, hand-drawn outline via plane shape
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 30;
    const h = 2.2;
    const baseY = 0;
    shape.moveTo(-w / 2, baseY);

    // Soft mountain silhouette — sum of sine waves for natural feel
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = -w / 2 + t * w;
      const wave =
        Math.sin(t * Math.PI * 1.4) * 0.6 +
        Math.sin(t * Math.PI * 3.7 + 0.7) * 0.25 +
        Math.sin(t * Math.PI * 6.1 + 1.3) * 0.12;
      const y = baseY + h * (0.55 + wave * 0.35);
      shape.lineTo(x, y);
    }
    shape.lineTo(w / 2, baseY);
    shape.lineTo(-w / 2, baseY);
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[0, 0.4, -8.5]}
      raycast={() => null}
    >
      <meshBasicMaterial color="#6e8a8a" />
    </mesh>
  );
}

function Lake() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.02, -7.8]}
      raycast={() => null}
    >
      <planeGeometry args={[18, 2.4]} />
      <meshBasicMaterial color="#a4b4be" />
    </mesh>
  );
}

function MistBand() {
  const tex = useMemo(() => createMistTexture(), []);
  return (
    <mesh
      position={[0, 1.0, -7.2]}
      raycast={() => null}
    >
      <planeGeometry args={[24, 2.2]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </mesh>
  );
}

function ForegroundTreeSilhouettes() {
  // A few soft dark-teal tree blobs at the left & right edges of midground
  // Adds depth + frames the scene (hand-drawn silhouette feel).
  const trees = [
    { pos: [-5.6, 0.9, -3.5], scale: [1.1, 1.8, 1.0] },
    { pos: [-4.4, 1.1, -4.5], scale: [0.9, 2.2, 1.0] },
    { pos: [4.6, 0.85, -3.0], scale: [1.0, 1.7, 1.0] },
    { pos: [5.8, 1.0, -4.2], scale: [1.2, 2.0, 1.0] },
  ];
  return (
    <group raycast={() => null}>
      {trees.map((t, i) => (
        <mesh key={i} position={t.pos} scale={t.scale}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshBasicMaterial color="#5b7a5b" />
        </mesh>
      ))}
    </group>
  );
}

export default function BackgroundLayers() {
  return (
    <>
      <DistantMountains />
      <Lake />
      <MistBand />
      <ForegroundTreeSilhouettes />
    </>
  );
}
