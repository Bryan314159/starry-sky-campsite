import SignBoard from './SignBoard';

/**
 * Layout signboards in two vertical columns:
 *   - Left column:  indices 0, 2, 4, ...
 *   - Right column: indices 1, 3, 5, ...
 *
 * When N is small the two columns stay close to the pole; when N is large
 * the columns fan outward and shrink horizontally to keep the whole signpost
 * inside the camera view.
 *
 * Column spacing: scales with N so the signpost always fits the visible area.
 * Per-row spacing: scales with N to avoid an unreasonably tall column.
 */

function layoutTwoColumns(folders) {
  if (folders.length === 0) return [];

  // Split into left/right
  const left = folders.filter((_, i) => i % 2 === 0);  // 0, 2, 4
  const right = folders.filter((_, i) => i % 2 === 1); // 1, 3, 5
  const rows = Math.max(left.length, right.length);

  // Scale dimensions based on total count
  const N = folders.length;
  // Horizontal offset shrinks slightly as we add more boards
  const columnOffset = Math.max(0.55, 0.95 - N * 0.04);
  // Vertical spacing shrinks as we add more rows
  const rowSpacing = Math.max(0.35, 0.6 - rows * 0.02);
  // Board width scales down a bit for many boards
  // (not used in this function — SignBoard itself uses a fixed width)

  const BASE_Y = 0.4;
  const result = [];

  // Left column: indices 0, 2, 4, ...
  left.forEach((folder, i) => {
    result.push({
      folder,
      position: [-columnOffset, BASE_Y + i * rowSpacing, 0],
    });
  });

  // Right column: indices 1, 3, 5, ...
  right.forEach((folder, i) => {
    result.push({
      folder,
      position: [columnOffset, BASE_Y + i * rowSpacing, 0],
    });
  });

  return result;
}

export default function Signpost({ folders, onSelectFolder }) {
  const emptyMessages = [
    '在这里添加你的第一个书签',
    '在书签栏创建文件夹',
    '然后回到这里',
  ];

  if (!folders || folders.length === 0) {
    const empty = emptyMessages.map((msg, i) => ({ id: `empty-${i}`, name: msg }));
    const laid = layoutTwoColumns(empty);

    return (
      <group position={[1.0, 1.75, 0]}>
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
          <meshToonMaterial color="#a0724a" />
        </mesh>
        {laid.map((item) => (
          <SignBoard
            key={item.folder.id}
            folder={item.folder}
            position={item.position}
            onClick={() => {}}
          />
        ))}
      </group>
    );
  }

  const laid = layoutTwoColumns(folders);

  return (
    <group position={[1.0, 1.75, 0]}>
      {/* Pole - non-interactive so clicks pass through to signboards */}
      <mesh position={[0, 0, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
        <meshToonMaterial color="#a0724a" />
      </mesh>

      {/* Two-column signboards */}
      {laid.map((item) => (
        <SignBoard
          key={item.folder.id}
          folder={item.folder}
          position={item.position}
          onClick={onSelectFolder}
        />
      ))}
    </group>
  );
}
