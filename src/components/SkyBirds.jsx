import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { SCENE1_CALIBRATION } from '../config/scene1Calibration';
import * as THREE from 'three';

/**
 * Distant flying birds (V-shape silhouettes) in the sky.
 *
 * Tiny dark "M" / "V" silhouettes drifting slowly across the sky band.
 * Matches the small dots in the reference image's mid-sky.
 * Pure flat-toon (no shading), slow horizontal drift + wing flap.
 */

function createBirdSilhouetteTexture() {
  const w = 128;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#3a2f24';
  // Two simple wing curves forming an "M"
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.quadraticCurveTo(32, 14, 64, 28);
  ctx.quadraticCurveTo(96, 14, 118, 40);
  ctx.quadraticCurveTo(96, 22, 64, 34);
  ctx.quadraticCurveTo(32, 22, 10, 40);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const { count: COUNT, yRange, zRange, xRange, speed: BASE_SPEED, seed } = SCENE1_CALIBRATION.skyBirds;

export default function SkyBirds() {
  const refs = useRef([]);
  const tex = useMemo(() => createBirdSilhouetteTexture(), []);

  const birds = useMemo(() => {
    const rand = seededRandom(seed);
    const xSpan = xRange[1] - xRange[0];
    const ySpan = yRange[1] - yRange[0];
    const zSpan = zRange[1] - zRange[0];
    return Array.from({ length: COUNT }, (_, i) => ({
      x: xRange[0] + (i * xSpan) / COUNT + rand() * 1.5,
      y: yRange[0] + rand() * ySpan,
      z: zRange[0] + rand() * zSpan,
      speed: BASE_SPEED + rand() * 0.2,
      flapPhase: rand() * Math.PI * 2,
      flapSpeed: 4 + rand() * 3,
      scale: 0.45 + rand() * 0.35,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    birds.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      // Drift horizontally, wrap around
      let x = b.x + t * b.speed;
      const range = 16;
      if (x > 8) x -= range;
      m.position.x = x;
      // Wing flap = scale.y oscillation (squash/stretch)
      const flap = 0.7 + 0.3 * Math.sin(t * b.flapSpeed + b.flapPhase);
      m.scale.set(b.scale, b.scale * flap, b.scale);
    });
  });

  return (
    <group raycast={() => null}>
      {birds.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[b.x, b.y, b.z]}
          rotation={[0, 0, 0]}
          raycast={() => null}
        >
          <planeGeometry args={[1, 0.5]} />
          <meshBasicMaterial
            map={tex}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            opacity={0.55}
          />
          <Outlines
            thickness={0.08}
            opacity={1}
            transparent
            angle={Math.PI}
          />
        </mesh>
      ))}
    </group>
  );
}
