import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Star({ bookmark, position, size, onHoverChange }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? size * 1.3 : size;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const current = ref.current.scale.x;
    const next = current + (targetScale - current) * 8 * delta;
    ref.current.scale.setScalar(next);

    // Subtle breathing glow
    if (!hovered) {
      const breathe = 1 + Math.sin(Date.now() * 0.001 + position[0]) * 0.03;
      ref.current.scale.setScalar(next * breathe);
    }

    // Update emissive intensity
    const targetEmit = hovered ? 2.0 : 0.6;
    const currentEmit = ref.current.material.emissiveIntensity;
    ref.current.material.emissiveIntensity =
      currentEmit + (targetEmit - currentEmit) * 8 * delta;
  });

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
      // Notify parent for tooltip positioning
      if (onHoverChange) {
        const screenPos = new THREE.Vector3();
        ref.current.getWorldPosition(screenPos);
        onHoverChange({ visible: true, position: screenPos, bookmark });
      }
    },
    [bookmark, onHoverChange],
  );

  const handlePointerOut = useCallback(
    (e) => {
      e.stopPropagation();
      setHovered(false);
      document.body.style.cursor = 'auto';
      if (onHoverChange) {
        onHoverChange({ visible: false, bookmark: null });
      }
    },
    [onHoverChange],
  );

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (bookmark.url) {
          window.location.href = bookmark.url;
        }
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}
