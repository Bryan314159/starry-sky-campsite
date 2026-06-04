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
const STARRY_POS = new THREE.Vector3(0, 0.2, 0.5);
const STARRY_LOOK = new THREE.Vector3(0, 8, -5);

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
  const [diag, setDiag] = useState(null);

  const handleHoverChange = useCallback((info) => {
    setHoverInfo(info);
  }, []);

  // Diagnostic: actually call getTree and display result
  useEffect(() => {
    if (typeof window.chrome === 'undefined' || !window.chrome.bookmarks) {
      setDiag({ error: 'no chrome.bookmarks' });
      return;
    }

    const out = {
      keys: Object.keys(window.chrome.bookmarks),
      apiType: 'present',
    };

    // Try both callback and promise
    try {
      window.chrome.bookmarks.getTree((tree) => {
        out.callbackResult = {
          type: typeof tree,
          length: tree?.length,
          firstNode: tree?.[0] ? {
            id: tree[0].id,
            title: tree[0].title,
            childCount: tree[0].children?.length,
            firstChild: tree[0].children?.[0] ? {
              id: tree[0].children[0].id,
              title: tree[0].children[0].title,
              childCount: tree[0].children[0].children?.length,
            } : null,
          } : null,
        };
        setDiag({ ...out });
        console.log('[星空营地] getTree callback result:', out.callbackResult);
      });
    } catch (e) {
      out.callbackError = e.message;
    }

    // Also try promise
    Promise.resolve(window.chrome.bookmarks.getTree()).then((tree) => {
      out.promiseResult = {
        type: typeof tree,
        length: tree?.length,
      };
      setDiag({ ...out });
    }).catch((e) => {
      out.promiseError = e.message;
      setDiag({ ...out });
    });
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

      {diag && (
        <div
          style={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 100,
            padding: 10,
            background: 'rgba(0,0,0,0.9)',
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: 10,
            lineHeight: 1.4,
            borderRadius: 4,
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify(diag, null, 2)}
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
