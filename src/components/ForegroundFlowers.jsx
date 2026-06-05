import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Foreground 3D wildflowers (daisies / buttercups).
 *
 * Procedural low-poly: each flower is a small yellow center sphere
 * + N small white petals (planes or low-poly cones). Scattered
 * procedurally on the ground with seeded-ish random positions, biased
 * to the foreground (z > 0) and to the sides of the path so the path
 * stays clear.
 *
 * art-style.md alignment: flat toon colors, no shadows, low saturation.
 * Adds a layer of detail between the camera and the path that the
 * pure ground texture can't give.
 */

function seededRandom(seed) {
  // Mulberry32 — small deterministic PRNG
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function daisyPositions() {
  const rand = seededRandom(20260605);
  const flowers = [];
  // 24 daisies scattered in the foreground
  for (let i = 0; i < 24; i++) {
    // bias: 70% near foreground (z in 1..3.5), 30% midground (z in -1..1)
    const z = rand() < 0.7
      ? 1 + rand() * 2.5
      : -1 + rand() * 2;

    // Sides of the path (avoid x in -0.5..0.5)
    let x;
    if (rand() < 0.5) {
      x = -0.5 - rand() * 2.8; // left side
    } else {
      x = 0.5 + rand() * 2.8;  // right side
    }

    flowers.push({
      x,
      z,
      y: 0,
      scale: 0.7 + rand() * 0.5,
      rot: rand() * Math.PI * 2,
      type: rand() < 0.6 ? 'daisy' : 'buttercup',
      tint: 0.92 + rand() * 0.16,
    });
  }
  return flowers;
}

function buttercupPositions() {
  const rand = seededRandom(99887766);
  const flowers = [];
  for (let i = 0; i < 14; i++) {
    const z = 0.5 + rand() * 3;
    let x;
    if (rand() < 0.5) x = -0.5 - rand() * 2.5;
    else x = 0.5 + rand() * 2.5;
    flowers.push({
      x,
      z,
      y: 0,
      scale: 0.55 + rand() * 0.4,
      rot: rand() * Math.PI * 2,
    });
  }
  return flowers;
}

function Daisy({ pos, scale, rot }) {
  // 5 white petals around a yellow center
  const petals = useMemo(() => {
    const arr = [];
    const N = 5;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      arr.push({
        x: Math.cos(a) * 0.08,
        z: Math.sin(a) * 0.08,
        rot: -a,
      });
    }
    return arr;
  }, []);

  return (
    <group position={[pos.x, pos.y, pos.z]} rotation={[0, rot, 0]} scale={scale}>
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, 0.05, p.z]}
          rotation={[-Math.PI / 2 + 0.4, 0, p.rot]}
          raycast={() => null}
        >
          <planeGeometry args={[0.07, 0.11]} />
          <meshToonMaterial color="#faf3e1" side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]} raycast={() => null}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshToonMaterial color="#e8b04a" />
      </mesh>
    </group>
  );
}

function Buttercup({ pos, scale, rot }) {
  // 4 small overlapping yellow disks + a green stem
  return (
    <group position={[pos.x, pos.y, pos.z]} rotation={[0, rot, 0]} scale={scale}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <circleGeometry args={[0.08, 12]} />
        <meshToonMaterial color="#f0c860" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0.5]} raycast={() => null}>
        <circleGeometry args={[0.06, 10]} />
        <meshToonMaterial color="#f5d27a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 1.0]} raycast={() => null}>
        <circleGeometry args={[0.05, 10]} />
        <meshToonMaterial color="#fbe39a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function ForegroundFlowers() {
  const daisies = useMemo(() => daisyPositions(), []);
  const buttercups = useMemo(() => buttercupPositions(), []);

  return (
    <group raycast={() => null}>
      {daisies.map((d, i) => (
        <Daisy key={`d-${i}`} pos={d} scale={d.scale} rot={d.rot} />
      ))}
      {buttercups.map((b, i) => (
        <Buttercup key={`b-${i}`} pos={b} scale={b.scale} rot={b.rot} />
      ))}
    </group>
  );
}
