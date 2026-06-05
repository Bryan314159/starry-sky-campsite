import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');

  // Wood-like background with hand-drawn quality
  ctx.fillStyle = '#f5e6d3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hand-drawn wobble border
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 8;
  ctx.lineJoin = 'round';
  const pad = 12;
  const wobble = 6;
  ctx.beginPath();
  ctx.moveTo(pad + wobble, pad);
  ctx.lineTo(canvas.width - pad - wobble, pad + 2);
  ctx.lineTo(canvas.width - pad + 2, canvas.height - pad + wobble);
  ctx.lineTo(pad - 2, canvas.height - pad - wobble);
  ctx.closePath();
  ctx.stroke();

  // Text — large and bold
  ctx.fillStyle = '#3b2a13';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Try common Chinese fonts (system fallbacks)
  const fontFamilies = ['"PingFang SC"', '"Microsoft YaHei"', '"SimHei"', '"STKaiti"', '"KaiTi"', 'serif'];

  const maxWidth = canvas.width - 100;
  let fontSize = 110;
  for (const family of fontFamilies) {
    ctx.font = `bold ${fontSize}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
  }
  // Shrink-to-fit
  while (ctx.measureText(text).width > maxWidth && fontSize > 32) {
    fontSize -= 4;
    const family = fontFamilies[0];
    ctx.font = `bold ${fontSize}px ${family}`;
  }

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function SignBoard({ folder, position, onClick }) {
  const ref = useRef();

  const texture = useMemo(
    () => createTextTexture(folder.name),
    [folder.name],
  );

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
      <planeGeometry args={[1.2, 0.25]} />
      <meshToonMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}
