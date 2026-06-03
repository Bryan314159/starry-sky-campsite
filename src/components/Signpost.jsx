import SignBoard from './SignBoard';

export default function Signpost({ folders, onSelectFolder }) {
  if (!folders || folders.length === 0) {
    return (
      <group position={[0, 1.75, 0]}>
        {/* Pole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
          <meshToonMaterial color="#a0724a" />
        </mesh>
        {/* Placeholder signboards */}
        {[
          '在这里添加你的第一个书签',
          '在书签栏创建文件夹来整理你的收藏',
          '然后回到这里，探索你的星空',
        ].map((text, i) => (
          <SignBoard
            key={i}
            folder={{ id: `empty-${i}`, name: text }}
            position={[0, 0.6 + i * 0.5, 0]}
            rotationY={-0.4 + i * 0.3}
            onClick={() => {}}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={[2.5, 1.75, 0]}>
      {/* Pole */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
        <meshToonMaterial color="#a0724a" />
      </mesh>

      {/* Sign boards */}
      {folders.map((folder, i) => (
        <SignBoard
          key={folder.id}
          folder={folder}
          position={[0, 0.6 + i * 0.45, 0]}
          rotationY={-0.6 + i * 0.25}
          onClick={onSelectFolder}
        />
      ))}
    </group>
  );
}
