import { useMemo } from 'react';
import { Outlines } from '@react-three/drei';
import { TOON_GRADIENT_MAP } from '../utils/toonGradientMap';
import * as THREE from 'three';
import SignBoard from './SignBoard';
import SignpostBird from './SignpostBird';

/**
 * Layout signboards in two vertical columns:
 *   - Left column:  indices 0, 2, 4, ...
 *   - Right column: indices 1, 3, 5, ...
 *
 * When N is small the two columns stay close to the pole; when N is large
 * the columns fan outward and shrink horizontally to keep the whole signpost
 * inside the camera view.
 */

function layoutTwoColumns(folders) {
  if (folders.length === 0) return [];

  const left = folders.filter((_, i) => i % 2 === 0);
  const right = folders.filter((_, i) => i % 2 === 1);
  const rows = Math.max(left.length, right.length);

  const N = folders.length;
  const columnOffset = Math.max(0.55, 0.95 - N * 0.04);
  const rowSpacing = Math.max(0.35, 0.6 - rows * 0.02);

  const BASE_Y = 0.4;
  const result = [];

  left.forEach((folder, i) => {
    result.push({
      folder,
      position: [-columnOffset, BASE_Y + i * rowSpacing, 0],
    });
  });

  right.forEach((folder, i) => {
    result.push({
      folder,
      position: [columnOffset, BASE_Y + i * rowSpacing, 0],
    });
  });

  return result;
}

/**
 * Wood-grain texture for the pole — vertical streaks of slightly varying
 * warm umber, plus a few darker "knots" for character. Low opacity to
 * keep the toon look (no per-pixel shading).
 */
function createWoodGrainTexture() {
  const w = 256;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#a0724a';
  ctx.fillRect(0, 0, w, h);

  // Vertical grain streaks
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w;
    const streakW = 1 + Math.random() * 3;
    const lightness = (Math.random() - 0.5) * 0.25;
    const r = Math.round(160 + lightness * 80);
    const g = Math.round(114 + lightness * 60);
    const b = Math.round(74 + lightness * 50);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + Math.random() * 0.4})`;
    ctx.lineWidth = streakW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    // Slight wave
    const steps = 20;
    for (let s = 0; s <= steps; s++) {
      const y = (s / steps) * h;
      const xx = x + Math.sin(s * 0.4 + i) * 4;
      ctx.lineTo(xx, y);
    }
    ctx.stroke();
  }

  // Knots
  for (let i = 0; i < 6; i++) {
    const x = 30 + Math.random() * (w - 60);
    const y = 80 + Math.random() * (h - 160);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 14);
    grad.addColorStop(0, 'rgba(75, 50, 30, 0.7)');
    grad.addColorStop(1, 'rgba(75, 50, 30, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function SignpostPole() {
  const woodMap = useMemo(() => createWoodGrainTexture(), []);
  return (
    <>
      {/* Main pole */}
      <mesh position={[0, 0, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.12, 0.16, 3.7, 10]} />
        <meshToonMaterial map={woodMap} gradientMap={TOON_GRADIENT_MAP} color="#b58560" />
        <Outlines
          thickness={4}
          color="#2a1f15"
          screenspace
          opacity={1}
          transparent={false}
          angle={Math.PI}
        />
      </mesh>

      {/* Small base flare for stability — hand-drawn "stake" feel */}
      <mesh position={[0, -1.78, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.18, 0.22, 0.18, 10]} />
        <meshToonMaterial color="#7a553a" gradientMap={TOON_GRADIENT_MAP} />
        <Outlines
          thickness={4}
          color="#2a1f15"
          screenspace
          opacity={1}
          transparent={false}
          angle={Math.PI}
        />
      </mesh>

      {/* Cap on top — little wooden knob (replaced by bird) */}
      <mesh position={[0, 1.9, 0]} castShadow raycast={() => null}>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshToonMaterial color="#8b6238" gradientMap={TOON_GRADIENT_MAP} />
        <Outlines
          thickness={4}
          color="#2a1f15"
          screenspace
          opacity={1}
          transparent={false}
          angle={Math.PI}
        />
      </mesh>

      {/* Perched bird on top of the post — matches reference image detail */}
      <SignpostBird />
    </>
  );
}

export default function Signpost({ folders, onSelectFolder }) {
  const emptyMessages = [
    '在这里添加你的第一个书签',
    '在书签栏创建文件夹',
    '然后回到这里',
  ];

  // Group position tuned so the pole sits at the right-third intersection
  // (matches scene-design.md "right-third golden ratio" rule and the
  // reference image where the signpost dominates the right ~30% of frame)
  const GROUP_POS = [1.6, 1.78, -0.2];

  if (!folders || folders.length === 0) {
    const empty = emptyMessages.map((msg, i) => ({ id: `empty-${i}`, name: msg }));
    const laid = layoutTwoColumns(empty);

    return (
      <group position={GROUP_POS}>
        <SignpostPole />
        {laid.map((item) => (
          <SignBoard
            key={item.folder.id}
            folder={item.folder}
            position={item.position}
            onClick={() => {}}
          />
        ))}
      </group>
    );
  }

  const laid = layoutTwoColumns(folders);

  return (
    <group position={GROUP_POS}>
      <SignpostPole />
      {laid.map((item) => (
        <SignBoard
          key={item.folder.id}
          folder={item.folder}
          position={item.position}
          onClick={onSelectFolder}
        />
      ))}
    </group>
  );
}
