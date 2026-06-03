import { useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';
import Campsite from './scenes/Campsite';
import StarrySky from './scenes/StarrySky';
import SearchBar from './overlays/SearchBar';
import Tooltip from './overlays/Tooltip';
import * as THREE from 'three';

const CAMPSITE_POS = new THREE.Vector3(0, 1.5, 5.0);
const CAMPSITE_LOOK = new THREE.Vector3(0, 1.0, -2.0);
const STARRY_POS = new THREE.Vector3(0, 0.2, 0);
const STARRY_LOOK = new THREE.Vector3(0, 5, -2);

function CameraController() {
  const { state } = useAppContext();
  const { camera } = useThree();

  useEffect(() => {
    if (state.scene === 'starry') {
      camera.position.copy(STARRY_POS);
      camera.lookAt(STARRY_LOOK);
      camera.fov = 70;
      camera.updateProjectionMatrix();
    } else {
      camera.position.copy(CAMPSITE_POS);
      camera.lookAt(CAMPSITE_LOOK);
      camera.fov = 60;
      camera.updateProjectionMatrix();
    }
  }, [state.scene, camera]);

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
