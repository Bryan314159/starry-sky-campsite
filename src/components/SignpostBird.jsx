import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Small hand-drawn bird silhouette perched on top of the signpost.
 *
 * Matches a key reference image detail (a small bird on the post top).
 * Two silhouette planes (one for body+head, one for wing) made from
 * canvas-painted shapes — gives the flat ink-wash look required by
 * art-style.md §3.2 (no painted shadows).
 *
 * Subtle wing flap animation + body breathing keeps it alive without
 * being distracting.
 */
function createBirdTexture() {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, w, h);

  // Body + head as a single rounded blob (silhouette)
  ctx.fillStyle = '#1f1a14';
  ctx.beginPath();
  // Head
  ctx.ellipse(170, 100, 28, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.ellipse(130, 140, 55, 38, -0.25, 0, Math.PI * 2);
  ctx.fill();
  // Tail
  ctx.beginPath();
  ctx.moveTo(70, 130);
  ctx.lineTo(40, 110);
  ctx.lineTo(40, 150);
  ctx.lineTo(75, 150);
  ctx.closePath();
  ctx.fill();
  // Beak
  ctx.fillStyle = '#d4a155';
  ctx.beginPath();
  ctx.moveTo(195, 100);
  ctx.lineTo(215, 96);
  ctx.lineTo(195, 108);
  ctx.closePath();
  ctx.fill();
  // Eye
  ctx.fillStyle = '#f4e8d0';
  ctx.beginPath();
  ctx.arc(178, 95, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1f1a14';
  ctx.beginPath();
  ctx.arc(179, 95, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Feet
  ctx.strokeStyle = '#1f1a14';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(130, 175);
  ctx.lineTo(130, 188);
  ctx.moveTo(120, 175);
  ctx.lineTo(120, 188);
  ctx.moveTo(140, 175);
  ctx.lineTo(140, 188);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createWingTexture() {
  const w = 128;
  const h = 96;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#1f1a14';
  ctx.beginPath();
  ctx.moveTo(8, h / 2);
  ctx.bezierCurveTo(20, 10, 100, 10, 118, h / 2);
  ctx.bezierCurveTo(100, h - 10, 20, h - 10, 8, h / 2);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function SignpostBird() {
  const wingRef = useRef();
  const bodyRef = useRef();

  const bodyTex = useMemo(() => createBirdTexture(), []);
  const wingTex = useMemo(() => createWingTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wingRef.current) {
      wingRef.current.rotation.z = Math.sin(t * 1.2) * 0.25;
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = 1.92 + Math.sin(t * 1.8) * 0.01;
    }
  });

  return (
    <group ref={bodyRef} position={[0, 1.92, 0]} raycast={() => null}>
      {/* Body — main plane facing camera */}
      <mesh raycast={() => null}>
        <planeGeometry args={[0.42, 0.34]} />
        <meshBasicMaterial
          map={bodyTex}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
        <Outlines
          thickness={0.08}
          opacity={1}
          transparent
          angle={Math.PI}
        />
      </mesh>
      {/* Cross-plane (perpendicular) so the bird reads from any angle */}
      <mesh rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[0.32, 0.3]} />
        <meshBasicMaterial
          map={bodyTex}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          opacity={0.65}
        />
        <Outlines
          thickness={0.08}
          opacity={1}
          transparent
          angle={Math.PI}
        />
      </mesh>
      {/* Wing — small flap */}
      <mesh
        ref={wingRef}
        position={[0.02, 0.04, 0.04]}
        raycast={() => null}
      >
        <planeGeometry args={[0.18, 0.12]} />
        <meshBasicMaterial
          map={wingTex}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
        <Outlines
          thickness={0.08}
          opacity={1}
          transparent
          angle={Math.PI}
        />
      </mesh>
    </group>
  );
}
