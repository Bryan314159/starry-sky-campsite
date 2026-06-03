import { Canvas } from '@react-three/fiber';
import { AppProvider, useAppContext } from './context/AppContext';
import { useBookmarks } from './hooks/useBookmarks';
import Campsite from './scenes/Campsite';

function SceneRouter() {
  const { state, dispatch } = useAppContext();

  if (!state.bookmarksLoaded) return null;

  return (
    <>
      {state.scene === 'campsite' && <Campsite />}
      {state.scene === 'starry' && <StarryPlaceholder dispatch={dispatch} />}
    </>
  );
}

function StarryPlaceholder({ dispatch }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <mesh
        position={[0, 0.01, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => dispatch({ type: 'RETURN_TO_CAMPSITE' })}
        onPointerOver={(e) => {
          e.object.scale.set(1.02, 1, 1.02);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.object.scale.set(1, 1, 1);
          document.body.style.cursor = 'auto';
        }}
      >
        <planeGeometry args={[1.5, 15]} />
        <meshToonMaterial color="#c4a46c" />
      </mesh>
      <mesh position={[0, 3, -4]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
      </mesh>
    </>
  );
}

function AppInner() {
  useBookmarks();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        <SceneRouter />
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
