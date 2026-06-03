import { Canvas } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';

function SceneContent() {
  const { state } = useAppContext();

  if (!state.bookmarksLoaded) {
    return null;
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={state.scene === 'campsite' ? '#e8b88a' : '#4a6fa5'} />
      </mesh>
    </>
  );
}

function AppInner() {
  useBookmarks();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <SceneContent />
      </Canvas>
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
