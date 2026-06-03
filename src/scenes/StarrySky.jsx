import { useAppContext } from '../context/AppContext';
import SkyDome from '../components/SkyDome';
import Ground from '../components/Ground';
import Path from '../components/Path';
import StarField from '../components/StarField';

export default function StarrySky({ onHoverChange }) {
  const { state, dispatch } = useAppContext();

  const bookmarks = state.selectedFolder?.children || [];

  return (
    <>
      <SkyDome variant="night" />
      <ambientLight intensity={0.15} />
      <StarField bookmarks={bookmarks} onHoverChange={onHoverChange} />
      <Ground />
      <Path
        onClick={() => dispatch({ type: 'RETURN_TO_CAMPSITE' })}
      />
    </>
  );
}
