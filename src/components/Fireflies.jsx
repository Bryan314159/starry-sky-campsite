import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SCENE1_CALIBRATION } from '../config/scene1Calibration';
import * as THREE from 'three';

/**
 * Floating fireflies / embers.
 *
 * Hand-painted aesthetic: NOT lens-flare particles, NOT sharp points.
 * Each firefly is a small warm-gold sphere with a soft halo (additive
 * sprite) — drifts slowly on independent sine paths + per-particle
 * flicker. Reads as "warm dust / 萤火虫" (a Luo Xiaohei healing-style
 * detail mentioned in art-style.md §6.2 "万物有灵的诗意").
 *
 * Toon-friendly: spheres use MeshBasicMaterial (no shading),
 * halo sprites are translucent additive blends.
 *
 * 任务 2.18 评估：drei `<Sparkles>` vs 当前自定义实现
 * ─────────────────────────────────────────────────────
 * 备选方案：drei `<Sparkles>` (一行替换 ~130 行)
 *
 * 决策（2026-06-08）：**保留自定义**
 *   1. 失去"暖金 + 闪烁"手作感 —— drei Sparkles 是点状光斑，无 per-particle
 *      flicker / 软 halo 渐变
 *   2. art-style.md §6.2 "万物有灵的诗意" 强调手工细节
 *   3. 不加 Outlines —— 萤火虫是"光点"，描边会让它们变"硬边小石头"
 *   4. 不改 toon 化 —— meshBasicMaterial 是萤火虫"自发光"的正确选择
 *      (toon 化反而会让光点失去"光"的感觉)
 *   5. 性能：14 个粒子 < drei Sparkles 内部默认 100 个
 *
 * 未来若需替换为 drei Sparkles：
 *   ```jsx
 *   import { Sparkles } from '@react-three/drei';
 *   <Sparkles
 *     count={14}
 *     scale={[9, 2.2, 6.5]}
 *     position={[0, 1.5, -0.5]}
 *     size={4}
 *     speed={0.3}
 *     color="#fff1c2"
 *   />
 *   ```
 *
 * 任务：2.18（评估决策 — 保留自定义）
 */
const { count: COUNT, range: RANGE, seed: SEED } = SCENE1_CALIBRATION.fireflies;

/**
 * Mulberry32 — fast, deterministic 32-bit PRNG. Replaces Math.random()
 * so particle positions stay stable across re-renders (no flicker).
 */
function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeHaloTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 220, 150, 1)');
  grad.addColorStop(0.35, 'rgba(255, 200, 110, 0.5)');
  grad.addColorStop(1, 'rgba(255, 200, 110, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function randomSeedParticles() {
  const rand = mulberry32(SEED);
  return Array.from({ length: COUNT }, () => ({
    base: new THREE.Vector3(
      RANGE.x[0] + rand() * (RANGE.x[1] - RANGE.x[0]),
      RANGE.y[0] + rand() * (RANGE.y[1] - RANGE.y[0]),
      RANGE.z[0] + rand() * (RANGE.z[1] - RANGE.z[0]),
    ),
    // Per-particle drift amplitudes + phases
    amp: new THREE.Vector3(
      0.4 + rand() * 0.6,
      0.3 + rand() * 0.5,
      0.3 + rand() * 0.6,
    ),
    phase: new THREE.Vector3(
      rand() * Math.PI * 2,
      rand() * Math.PI * 2,
      rand() * Math.PI * 2,
    ),
    flickerPhase: rand() * Math.PI * 2,
    flickerSpeed: 1.2 + rand() * 1.6,
    size: 0.04 + rand() * 0.04,
  }));
}

export default function Fireflies() {
  const groupRef = useRef();
  const sphereRefs = useRef([]);
  const haloRefs = useRef([]);

  const haloTex = useMemo(() => makeHaloTexture(), []);
  const particles = useMemo(() => randomSeedParticles(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const dx = Math.sin(t * 0.5 + p.phase.x) * p.amp.x * 0.4;
      const dy = Math.sin(t * 0.7 + p.phase.y) * p.amp.y * 0.3;
      const dz = Math.cos(t * 0.4 + p.phase.z) * p.amp.z * 0.4;
      const x = p.base.x + dx;
      const y = p.base.y + dy;
      const z = p.base.z + dz;

      if (sphereRefs.current[i]) {
        sphereRefs.current[i].position.set(x, y, z);
        const flicker = 0.5 + 0.5 * Math.sin(t * p.flickerSpeed + p.flickerPhase);
        sphereRefs.current[i].material.opacity = 0.45 + flicker * 0.55;
      }
      if (haloRefs.current[i]) {
        haloRefs.current[i].position.set(x, y, z);
        const flicker = 0.5 + 0.5 * Math.sin(t * p.flickerSpeed + p.flickerPhase);
        // Task 2.25: 缩小 halo 半径 2.4→1.6 避免近距大光斑
        const s = p.size * (1.6 + flicker * 0.6);
        haloRefs.current[i].scale.set(s, s, s);
        haloRefs.current[i].material.opacity = 0.25 + flicker * 0.45;
      }
    });
  });

  return (
    <group ref={groupRef} raycast={() => null}>
      {particles.map((p, i) => (
        <group key={i}>
          {/* Inner solid dot */}
          <mesh
            ref={(el) => (sphereRefs.current[i] = el)}
            position={p.base.toArray()}
            raycast={() => null}
          >
            <sphereGeometry args={[p.size * 0.35, 8, 6]} />
            <meshBasicMaterial
              color="#fff1c2"
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
          {/* Soft halo sprite — Task 2.25: 缩小到 2x 避免近距大光斑 */}
          <sprite
            ref={(el) => (haloRefs.current[i] = el)}
            position={p.base.toArray()}
            scale={[p.size * 2, p.size * 2, p.size * 2]}
            raycast={() => null}
          >
            <spriteMaterial
              map={haloTex}
              transparent
              opacity={0.5}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </group>
      ))}
    </group>
  );
}
