import { useAppContext } from '../context/AppContext';
import SkyDome from '../components/SkyDome';
import BackgroundLayers from '../components/BackgroundLayers';
import Ground from '../components/Ground';
import Path from '../components/Path';
import Campfire from '../components/Campfire';
import Signpost from '../components/Signpost';

/**
 * Scene 1 — Campsite (signposts).
 *
 * Layered front-to-back:
 *   1. SkyDome (gradient)
 *   2. BackgroundLayers (mountains, lake, mist, tree silhouettes)
 *   3. Ground + Path
 *   4. Campfire (atmosphere)
 *   5. Signpost (focal point)
 *
 * Lighting tuned for warm dusk (golden hour feel):
 *   - ambientLight: low warm wash
 *   - directionalLight: main warm sunset from upper-left
 *   - hemisphereLight: sky peach + ground sage for soft fill
 *   - subtle scene fog adds atmospheric perspective to the background
 */
export default function Campsite() {
  const { state, dispatch } = useAppContext();

  const handleSelectFolder = (folder) => {
    dispatch({ type: 'SELECT_FOLDER', payload: folder });
  };

  return (
    <>
      <fog attach="fog" args={['#e8d4b0', 8, 22]} />
      <SkyDome variant="day" />
      <ambientLight intensity={0.55} color="#fff2d8" />
      <directionalLight
        position={[5, 7, 3]}
        intensity={1.4}
        color="#ffd49a"
      />
      <hemisphereLight args={['#f5c8a0', '#5e7a45', 0.45]} />

      <BackgroundLayers />
      <Ground />
      <Path />
      <Campfire />
      <Signpost
        folders={state.folders}
        onSelectFolder={handleSelectFolder}
      />
    </>
  );
}
