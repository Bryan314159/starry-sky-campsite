import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Scattered grass tufts across the campsite ground.
 *
 * Implementation: InstancedMesh of a 3-blade grass clump geometry.
 * ~140 tufts total, distributed across the visible ground, biased
 * away from the path centerline and away from the campfire. Each
 * tuft has a slight Y-rotation and a per-instance scale variation.
 *
 * A subtle wind sway animation breathes the whole field — gives the
 * scene the "万物有灵的诗意" (art-style.md §6.2) feel.
 */

const TUFT_COUNT = 140;

function makeBladeGeometry() {
  // 3 thin vertical blades meeting at a base point.
  // Each blade = tapered triangle: 4 vertices (base pair, top point).
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.04, 0);
  bladeShape.lineTo(0, 0.32);
  bladeShape.closePath();
  const g = new THREE.ShapeGeometry(bladeShape);
  g.translate(0, 0, 0);
  return g;
}

function makeTuftGeometry() {
  // 3 blades, slightly fanned
  const blades = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const blade = makeBladeGeometry();
    blade.rotateZ((i - 1) * 0.18);
    blade.rotateY(a * 0.5);
    blade.translate(Math.cos(a) * 0.02, 0, Math.sin(a) * 0.02);
    blades.push(blade);
  }
  // Merge into one BufferGeometry by hand-rolled concat
  let totalVerts = 0;
  let totalIdx = 0;
  blades.forEach((b) => {
    totalVerts += b.attributes.position.count;
    totalIdx += b.index ? b.index.count : 0;
  });

  const positions = new Float32Array(totalVerts * 3);
  const indices = new Uint16Array(totalIdx);
  let vOff = 0;
  let iOff = 0;
  blades.forEach((b) => {
    const pos = b.attributes.position.array;
    for (let i = 0; i < pos.length; i++) {
      positions[vOff * 3 + i] = pos[i];
    }
    if (b.index) {
      for (let i = 0; i < b.index.array.length; i++) {
        indices[iOff + i] = b.index.array[i] + vOff;
      }
      iOff += b.index.array.length;
    }
    vOff += b.attributes.position.count;
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  merged.computeVertexNormals();
  return merged;
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

function generateTuftTransforms() {
  const rand = seededRandom(42424242);
  const transforms = [];
  for (let i = 0; i < TUFT_COUNT; i++) {
    // Bias toward foreground + sides
    let x, z;
    let attempts = 0;
    do {
      x = -5.5 + rand() * 11;
      z = -4 + rand() * 8;
      attempts++;
      // Reject: inside path, inside campfire area, inside signpost area
      if (Math.abs(x) < 0.55 && z > -10 && z < 4) continue;
      const dSignpost = Math.hypot(x - 1.6, z + 0.2);
      if (dSignpost < 0.7) continue;
      const dCampfire = Math.hypot(x, z - 1.5);
      if (dCampfire < 0.7) continue;
      break;
    } while (attempts < 5);

    const scale = 0.7 + rand() * 0.7;
    const rotY = rand() * Math.PI * 2;
    const phase = rand() * Math.PI * 2;
    transforms.push({ x, z, scale, rotY, phase });
  }
  return transforms;
}

export default function GrassTufts() {
  const ref = useRef();
  const tuftGeometry = useMemo(() => makeTuftGeometry(), []);
  const transforms = useMemo(() => generateTuftTransforms(), []);

  // Set initial transforms once
  useMemo(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    transforms.forEach((t, i) => {
      dummy.position.set(t.x, 0, t.z);
      dummy.rotation.set(0, t.rotY, 0);
      dummy.scale.setScalar(t.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  // Subtle wind sway
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    transforms.forEach((tr, i) => {
      const sway = Math.sin(t * 0.9 + tr.phase) * 0.08;
      dummy.position.set(tr.x, 0, tr.z);
      dummy.rotation.set(sway, tr.rotY, 0);
      dummy.scale.setScalar(tr.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[tuftGeometry, undefined, TUFT_COUNT]}
      raycast={() => null}
    >
      <meshToonMaterial color="#7a9f5a" side={THREE.DoubleSide} />
    </instancedMesh>
  );
}
