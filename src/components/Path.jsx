import { useMemo } from 'react';
import { Outlines } from '@react-three/drei';
import { useAppContext } from '../context/AppContext';
import * as THREE from 'three';

/**
 * Hand-painted dirt path. Instead of a flat rectangle we use a ShapeGeometry
 * with jittered, tapered edges (wider in the foreground, narrower into the
 * distance) — gives a natural "earth path" silhouette that fits the
 * watercolor / Luo Xiaohei aesthetic.
 *
 * In scene 2 the path is still the return-to-campsite trigger; the
 * click target is widened with an invisible rectangle on top of the shape.
 */
function buildPathShape() {
  const shape = new THREE.Shape();
  // 18 control points along the path; left and right edges jittered,
  // centerline follows a gentle curve (Bezier-ish).
  const segments = 18;
  const length = 15;
  const startZ = 4.0;
  const startHalfWidth = 1.0;
  const endHalfWidth = 0.18;

  // Random jitter (seeded-feel via fixed offsets)
  const jitter = [
    0.04, -0.05, 0.06, -0.03, 0.05, -0.07, 0.03, -0.04,
    0.06, -0.05, 0.04, -0.06, 0.05, -0.04, 0.07, -0.03,
    0.05, -0.04,
  ];

  // Centerline curve: gentle sway to the left, then back.
  // At t=0 → 0, t=0.5 → -0.7 (left), t=1 → 0.3
  const centerlineOffset = (t) => {
    const a = -0.7 * Math.sin(t * Math.PI);
    const b = 0.3 * t;
    return a + b;
  };

  // Start at front-left
  shape.moveTo(-startHalfWidth, startZ);

  // Left edge: front to back
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const z = startZ - t * length;
    const halfW = THREE.MathUtils.lerp(startHalfWidth, endHalfWidth, t);
    const cx = centerlineOffset(t);
    const x = cx - halfW + jitter[i % jitter.length] * (1 - t);
    shape.lineTo(x, z);
  }

  // Right edge: back to front
  for (let i = segments; i >= 0; i--) {
    const t = i / segments;
    const z = startZ - t * length;
    const halfW = THREE.MathUtils.lerp(startHalfWidth, endHalfWidth, t);
    const cx = centerlineOffset(t);
    const x = cx + halfW - jitter[(i + 5) % jitter.length] * (1 - t);
    shape.lineTo(x, z);
  }

  shape.closePath();
  return shape;
}

/**
 * Build a soft "speckled dirt" texture for the path.
 * Base color is warm earth brown with hand-painted darker spots and a
 * few lighter sandy highlights.
 */
function createDirtTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#c4a46c';
  ctx.fillRect(0, 0, size, size);

  // Darker dirt patches
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 30;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(139, 100, 60, 0.45)');
    grad.addColorStop(1, 'rgba(139, 100, 60, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lighter sandy highlights
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 6 + Math.random() * 18;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(230, 205, 160, 0.45)');
    grad.addColorStop(1, 'rgba(230, 205, 160, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tiny pebbles
  ctx.fillStyle = 'rgba(95, 75, 50, 0.7)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 4);
  tex.needsUpdate = true;
  return tex;
}

export default function Path({ onClick }) {
  const { state } = useAppContext();
  const isReturnTrigger = state.scene === 'starry';

  const shape = useMemo(() => buildPathShape(), []);
  const geometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  const dirtMap = useMemo(() => createDirtTexture(), []);

  return (
    <group>
      {/* Visible path shape */}
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={isReturnTrigger ? onClick : undefined}
        onPointerOver={
          isReturnTrigger
            ? (e) => {
                document.body.style.cursor = 'pointer';
              }
            : undefined
        }
        onPointerOut={
          isReturnTrigger
            ? () => {
                document.body.style.cursor = 'auto';
              }
            : undefined
        }
      >
        <meshToonMaterial map={dirtMap} color="#c4a46c" />
        <Outlines
          thickness={3}
          color="#5c4530"
          screenspace
          opacity={1}
          transparent={false}
          angle={Math.PI}
        />
      </mesh>
    </group>
  );
}
