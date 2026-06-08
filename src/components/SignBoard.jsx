import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { TOON_GRADIENT_MAP } from '../utils/toonGradientMap';
import * as THREE from 'three';

/**
 * Hand-painted signboard texture.
 *
 * - Cream wood base with subtle horizontal grain streaks
 * - Wobble border (hand-drawn feel, not vector-perfect)
 * - Handwritten Chinese characters in dark walnut ink
 * - Two small "nail dots" on each side
 */
function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');

  // Wood-like background — slight gradient for depth
  const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGrad.addColorStop(0, '#f5e6d3');
  baseGrad.addColorStop(0.5, '#f0dfc6');
  baseGrad.addColorStop(1, '#e8d4b6');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Horizontal wood grain streaks — very subtle
  for (let i = 0; i < 80; i++) {
    const y = Math.random() * canvas.height;
    ctx.strokeStyle = `rgba(160, 120, 80, ${0.05 + Math.random() * 0.08})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  // Wobble border (hand-drawn feel)
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  const pad = 14;
  const wobble = 4;
  ctx.beginPath();
  ctx.moveTo(pad + wobble, pad);
  ctx.lineTo(canvas.width - pad - wobble, pad + 1);
  ctx.lineTo(canvas.width - pad + 1, canvas.height - pad + wobble);
  ctx.lineTo(pad - 1, canvas.height - pad - wobble);
  ctx.closePath();
  ctx.stroke();

  // Inner faint border
  ctx.strokeStyle = 'rgba(139, 105, 20, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad + 18, pad + 10);
  ctx.lineTo(canvas.width - pad - 18, pad + 11);
  ctx.lineTo(canvas.width - pad - 19, canvas.height - pad - 10);
  ctx.lineTo(pad + 19, canvas.height - pad - 9);
  ctx.closePath();
  ctx.stroke();

  // Text — handwritten feel
  ctx.fillStyle = '#3b2a13';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontFamilies = ['"PingFang SC"', '"Microsoft YaHei"', '"SimHei"', '"STKaiti"', '"KaiTi"', 'serif'];

  const maxWidth = canvas.width - 120;
  let fontSize = 120;
  for (const family of fontFamilies) {
    ctx.font = `bold ${fontSize}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
  }
  while (ctx.measureText(text).width > maxWidth && fontSize > 32) {
    fontSize -= 4;
    const family = fontFamilies[0];
    ctx.font = `bold ${fontSize}px ${family}`;
  }

  // Slight shadow / ink bleed
  ctx.fillStyle = 'rgba(59, 42, 19, 0.18)';
  ctx.fillText(text, canvas.width / 2 + 1.5, canvas.height / 2 + 1.5);
  ctx.fillStyle = '#3b2a13';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Nail dots
  ctx.fillStyle = '#5b3a1f';
  for (const [nx, ny] of [[28, 128], [canvas.width - 28, 128]]) {
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 240, 210, 0.6)';
    ctx.beginPath();
    ctx.arc(nx - 1, ny - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5b3a1f';
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export default function SignBoard({ folder, position, onClick }) {
  const ref = useRef();
  const texture = useMemo(
    () => createTextTexture(folder.name),
    [folder.name],
  );

  // Subtle hover lift animation
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const baseY = position[1];
    const isHovered = document.body.style.cursor === 'pointer';
    if (isHovered) {
      ref.current.position.y = baseY + 0.05;
    } else {
      ref.current.position.y = baseY;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(folder);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <planeGeometry args={[1.2, 0.28]} />
      <meshToonMaterial map={texture} gradientMap={TOON_GRADIENT_MAP} side={THREE.DoubleSide} />
      <Outlines
        thickness={4}
        color="#2a1f15"
        screenspace
        opacity={1}
        transparent={false}
        angle={Math.PI}
      />
    </mesh>
  );
}
