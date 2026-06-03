import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';
import Campsite from './scenes/Campsite';
import StarrySky from './scenes/StarrySky';
import SearchBar from './overlays/SearchBar';
import Tooltip from './overlays/Tooltip';

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
        onCreated={({ camera }) => {
          camera.lookAt(0, 1.0, -2.0);
        }}
      >
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
