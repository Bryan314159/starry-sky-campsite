const COLORS = {
  day: { top: '#ffd89b', bottom: '#87CEEB' },
  night: { top: '#0a0d2e', bottom: '#1a1f4e' },
};

export default function SkyDome({ variant = 'day' }) {
  const colors = COLORS[variant] || COLORS.day;

  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[20, 32, 32]} />
      <meshBasicMaterial color={colors.top} side={1 /* BackSide */} />
    </mesh>
  );
}
