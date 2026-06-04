import { useAppContext } from '../context/AppContext';
import SkyDome from '../components/SkyDome';
import Ground from '../components/Ground';
import Path from '../components/Path';
import Signpost from '../components/Signpost';

export default function Campsite() {
  const { state, dispatch } = useAppContext();

  const handleSelectFolder = (folder) => {
    dispatch({ type: 'SELECT_FOLDER', payload: folder });
  };

  return (
    <>
      <SkyDome variant="day" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} color="#ffe4b5" />
      <hemisphereLight args={['#87ceeb', '#4b7b3d', 0.3]} />
      <Ground />
      <Path />
      <Signpost
        folders={state.folders}
        onSelectFolder={handleSelectFolder}
      />
    </>
  );
}
