import { useAppContext } from '../context/AppContext';
import SkyDome from '../components/SkyDome';
import BackgroundLayers from '../components/BackgroundLayers';
import Ground from '../components/Ground';
import GrassTufts from '../components/GrassTufts';
import ForegroundFlowers from '../components/ForegroundFlowers';
import Path from '../components/Path';
import Campfire from '../components/Campfire';
import ScorchMark from '../components/ScorchMark';
import Signpost from '../components/Signpost';
import Fireflies from '../components/Fireflies';
import SkyBirds from '../components/SkyBirds';

/**
 * Scene 1 — Campsite (signposts).
 *
 * Layered front-to-back:
 *   1. SkyDome (gradient) + SkyBirds
 *   2. BackgroundLayers (mountains, lake, mist, tree silhouettes)
 *   3. Ground + GrassTufts + ForegroundFlowers
 *   4. Path (curved)
 *   5. Campfire + ScorchMark (atmosphere)
 *   6. Signpost (focal point, with perched bird)
 *   7. Fireflies (between everything, additive blend)
 *
 * Lighting tuned for warm dusk (golden hour feel):
 *   - ambientLight: low warm wash
 *   - directionalLight: main warm sunset from upper-left
 *   - hemisphereLight: sky peach + ground sage for soft fill
 *   - pointLight at campfire: warm orange wash on nearby ground
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
      <SkyBirds />

      <ambientLight intensity={0.5} color="#fff2d8" />
      <directionalLight
        position={[5, 7, 3]}
        intensity={1.3}
        color="#ffd49a"
      />
      <hemisphereLight args={['#f5c8a0', '#5e7a45', 0.4]} />

      <BackgroundLayers />
      <Ground />
      <GrassTufts />
      <ForegroundFlowers />
      <Path />
      <Campfire />
      <ScorchMark />
      <Signpost
        folders={state.folders}
        onSelectFolder={handleSelectFolder}
      />
      <Fireflies />
    </>
  );
}
