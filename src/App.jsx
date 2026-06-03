import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';
import Campsite from './scenes/Campsite';
import StarrySky from './scenes/StarrySky';

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
  const [hoverInfo, setHoverInfo] = useState({ visible: false, bookmark: null });

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

      {/* Tooltip overlay */}
      {hoverInfo.visible && hoverInfo.bookmark && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '8px 16px',
            borderRadius: 14,
            background: 'rgba(10, 14, 42, 0.82)',
            color: '#fff4c8',
            fontFamily: '"STKaiti", "KaiTi", serif',
            fontSize: 14,
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 238, 170, 0.25)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {hoverInfo.bookmark.title}
        </div>
      )}
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
