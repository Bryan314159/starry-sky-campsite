import { useAppContext } from '../context/AppContext';

export default function Path({ onClick }) {
  const { state } = useAppContext();
  const isReturnTrigger = state.scene === 'starry';

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, 0]}
      onClick={isReturnTrigger ? onClick : undefined}
      onPointerOver={isReturnTrigger ? (e) => {
        e.object.scale.set(1.02, 1, 1.02);
        document.body.style.cursor = 'pointer';
      } : undefined}
      onPointerOut={isReturnTrigger ? (e) => {
        e.object.scale.set(1, 1, 1);
        document.body.style.cursor = 'auto';
      } : undefined}
    >
      <planeGeometry args={[1.5, 15]} />
      <meshToonMaterial color="#c4a46c" />
    </mesh>
  );
}
