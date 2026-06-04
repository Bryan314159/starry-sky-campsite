import SignBoard from './SignBoard';

export default function Signpost({ folders, onSelectFolder }) {
  if (!folders || folders.length === 0) {
    return (
      <group position={[1.0, 1.75, 0]}>
        {/* Pole - non-interactive */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
          <meshToonMaterial color="#a0724a" />
        </mesh>
        {/* Placeholder signboards */}
        {[
          '在这里添加你的第一个书签',
          '在书签栏创建文件夹',
          '然后回到这里',
        ].map((text, i) => (
          <SignBoard
            key={i}
            folder={{ id: `empty-${i}`, name: text }}
            position={[0, 0.5 + i * 0.5, 0.6]}
            onClick={() => {}}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={[1.0, 1.75, 0]}>
      {/* Pole - non-interactive so clicks pass through to signboards */}
      <mesh position={[0, 0, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
        <meshToonMaterial color="#a0724a" />
      </mesh>

      {/* Sign boards - offset toward camera so they don't intersect the pole */}
      {folders.map((folder, i) => (
        <SignBoard
          key={folder.id}
          folder={folder}
          position={[0, 0.5 + i * 0.5, 0.6]}
          onClick={onSelectFolder}
        />
      ))}
    </group>
  );
}
