import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Three-stop vertical gradient sky — NIGHT ONLY (scene 2).
 *
 * Task 2.22 — 拆分为 night-only 变体
 *   - day 变体已删除（场景一改用 BackgroundImage 静态图）
 *   - night 变体仍被 StarrySky.jsx 引用
 *
 * Top:    deep navy (high atmosphere)
 * Middle: indigo (mid sky)
 * Bottom: muted purple-blue (horizon glow)
 *
 * Uses a ShaderMaterial so the gradient is smooth and per-vertex free
 * (cheap on draw calls). Slight time-varying noise adds watercolor
 * brush-strokes feel without breaking the flat-shaded toon aesthetic.
 */
const VERTEX = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vWorldPos;
  uniform vec3 uColorTop;
  uniform vec3 uColorMid;
  uniform vec3 uColorBot;
  uniform float uTime;

  // Cheap hash-based noise for watercolor brush feel
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(0.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    // Normalize y to [0, 1] over the dome height.
    float h = clamp((vWorldPos.y + 10.0) / 20.0, 0.0, 1.0);

    // Two-segment gradient: bot -> mid (0..0.5), mid -> top (0.5..1.0)
    vec3 col;
    if (h < 0.5) {
      col = mix(uColorBot, uColorMid, smoothstep(0.0, 0.5, h));
    } else {
      col = mix(uColorMid, uColorTop, smoothstep(0.5, 1.0, h));
    }

    // Subtle watercolor wash — slowly drifting low-freq noise
    float n = noise(vWorldPos.xz * 0.08 + vec2(uTime * 0.01, 0.0));
    col = mix(col, col * (0.94 + 0.08 * n), 0.35);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const COLORS = {
  top: new THREE.Color('#0a0d2e'),
  mid: new THREE.Color('#1a1f4e'),
  bot: new THREE.Color('#2a2a5e'),
};

export default function SkyDome() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColorTop: { value: COLORS.top },
        uColorMid: { value: COLORS.mid },
        uColorBot: { value: COLORS.bot },
        uTime: { value: 0 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh raycast={() => null} material={material}>
      <sphereGeometry args={[20, 32, 32]} />
    </mesh>
  );
}
