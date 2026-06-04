export default function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow raycast={() => null}>
      <planeGeometry args={[12, 20]} />
      <meshToonMaterial color="#7a9f5a" />
    </mesh>
  );
}
