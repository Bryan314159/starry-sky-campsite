import { useState, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';
import Campsite from './scenes/Campsite';
import StarrySky from './scenes/StarrySky';
import SearchBar from './overlays/SearchBar';
import Tooltip from './overlays/Tooltip';
import * as THREE from 'three';

const CAMPSITE_POS = new THREE.Vector3(0, 1.5, 5.0);
const CAMPSITE_LOOK = new THREE.Vector3(0, 1.0, -2.0);
const STARRY_POS = new THREE.Vector3(0, 0.2, 0.5);
const STARRY_LOOK = new THREE.Vector3(0, 8, -5);

// Exponential damping coefficient. λ = 2.0 → ~95% in 1.5s, ~99% in 2.3s
// (frame-rate independent: alpha = 1 - exp(-λ·dt))
const DAMP_LAMBDA = 2.0;

// FOV change threshold — below this, skip the projection matrix update
// (avoids spamming updateProjectionMatrix when essentially settled)
const FOV_EPS = 0.01;

function CameraController() {
  const { state } = useAppContext();
  const { camera } = useThree();
  // Persistent "current look-at target" — also damps, not jumps
  const lookRef = useRef(new THREE.Vector3().copy(CAMPSITE_LOOK));

  useFrame((_, dt) => {
    const targetPos = state.scene === 'starry' ? STARRY_POS : CAMPSITE_POS;
    const targetLook = state.scene === 'starry' ? STARRY_LOOK : CAMPSITE_LOOK;
    const targetFov = state.scene === 'starry' ? 70 : 60;

    // Clamp dt to avoid huge jumps on tab-switch resume
    const clampedDt = Math.min(dt, 0.1);
    const alpha = 1 - Math.exp(-DAMP_LAMBDA * clampedDt);

    camera.position.lerp(targetPos, alpha);
    lookRef.current.lerp(targetLook, alpha);
    camera.lookAt(lookRef.current);

    if (Math.abs(camera.fov - targetFov) > FOV_EPS) {
      camera.fov += (targetFov - camera.fov) * alpha;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function SceneRouter({ onHoverChange }) {
  const { state } = useAppContext();

  if (!state.bookmarksLoaded) return null;

  return (
    <>
      {state.scene === 'campsite' && <Campsite />}
      {state.scene === 'starry' && (
        <StarrySky onHoverChange={onHoverChange} />
      )}
    </>
  );
}

function AppInner() {
  useBookmarks();
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    bookmark: null,
  });

  const handleHoverChange = useCallback((info) => {
    setHoverInfo(info);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{
          position: [0, 1.5, 5.0],
          fov: 60,
          near: 0.1,
          far: 50,
        }}
      >
        <CameraController />
        <SceneRouter onHoverChange={handleHoverChange} />
      </Canvas>

      <SearchBar />
      <Tooltip hoverInfo={hoverInfo} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
