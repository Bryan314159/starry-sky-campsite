import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Campfire: stone ring + toon-shaded flame cluster.
 * Non-interactive (raycast disabled) — pure atmosphere.
 *
 * Flame is built from 5 stacked cones in a warm gradient
 * (deep red → orange → pale yellow) — toon material gives the
 * flat 2-3 step color blocks characteristic of Luo Xiaohei.
 * Slight y-scale breathing animation keeps it alive.
 */
function FlameCluster() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const breath = 1.0 + Math.sin(t * 2.2) * 0.04;
    groupRef.current.scale.set(breath, 1.0 + Math.sin(t * 3.1) * 0.06, breath);
  });

  return (
    <group ref={groupRef} position={[0, 0.18, 0]}>
      {/* Outer flame — deep orange */}
      <mesh position={[0, 0.15, 0]} raycast={() => null}>
        <coneGeometry args={[0.22, 0.55, 8]} />
        <meshToonMaterial color="#d96b2c" />
      </mesh>
      {/* Mid flame — warm orange */}
      <mesh position={[0, 0.22, 0]} raycast={() => null}>
        <coneGeometry args={[0.16, 0.42, 8]} />
        <meshToonMaterial color="#e88a3c" />
      </mesh>
      {/* Inner flame — pale yellow */}
      <mesh position={[0, 0.28, 0]} raycast={() => null}>
        <coneGeometry args={[0.10, 0.32, 8]} />
        <meshToonMaterial color="#f5d27a" />
      </mesh>
      {/* Hottest core — near white */}
      <mesh position={[0, 0.32, 0]} raycast={() => null}>
        <coneGeometry args={[0.05, 0.18, 8]} />
        <meshToonMaterial color="#fbeec1" />
      </mesh>
      {/* Ember / glow halo at base */}
      <mesh position={[0, 0.05, 0]} raycast={() => null}>
        <sphereGeometry args={[0.28, 12, 8]} />
        <meshBasicMaterial
          color="#ffb168"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function StoneRing() {
  // 7 stones arranged in a circle — toon-shaded, slight color variation
  const stones = useMemo(() => {
    const arr = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 0.36 + Math.random() * 0.04;
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        sx: 0.16 + Math.random() * 0.06,
        sy: 0.14 + Math.random() * 0.06,
        rot: Math.random() * Math.PI,
        shade: 0.85 + Math.random() * 0.3,
      });
    }
    return arr;
  }, []);

  return (
    <group raycast={() => null}>
      {stones.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.sy * 0.5, s.z]}
          rotation={[0, s.rot, 0]}
          scale={[s.sx, s.sy, s.sx * 0.9]}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshToonMaterial color={new THREE.Color('#9a8e7a').multiplyScalar(s.shade)} />
        </mesh>
      ))}
    </group>
  );
}

function Logs() {
  // A couple of charred logs inside the ring
  return (
    <group position={[0, 0.06, 0]} raycast={() => null}>
      <mesh rotation={[0, 0.4, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
        <meshToonMaterial color="#5b3a1f" />
      </mesh>
      <mesh rotation={[0, -0.6, Math.PI / 2]} position={[0.02, 0.04, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.45, 8]} />
        <meshToonMaterial color="#4a2f1a" />
      </mesh>
    </group>
  );
}

export default function Campfire() {
  return (
    <group position={[0, 0, 1.5]}>
      <StoneRing />
      <Logs />
      <FlameCluster />
      {/* Warm fire-light — gently pulses with the flame breathing.
          distance=4 limits the cast so the signpost doesn't go fully orange,
          intensity=2.0 gives a visible warm wash on nearby ground/grass. */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={2.2}
        distance={4.5}
        decay={1.6}
        color="#ffb168"
      />
    </group>
  );
}
