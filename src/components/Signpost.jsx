import SignBoard from './SignBoard';

/**
 * Layout signboards in a fan/sector shape around the pole.
 *
 * Strategy:
 * - Boards are arranged in concentric rings around the pole
 * - Each ring spans an arc, with boards evenly distributed along it
 * - Outer rings are further from the pole and higher up
 * - Rings start at the front (facing camera) and spread left/right
 */

const RING_ARC = Math.PI * 0.35; // ~63° of arc per ring (tight to avoid overlap)
const MAX_PER_RING = 3;         // boards per ring
const FIRST_RING_RADIUS = 0.9;  // first ring distance from pole
const RING_GAP = 0.55;          // extra radius per additional ring
const Y_PER_RING = 0.55;        // height offset per ring
const BASE_Y = 0.3;             // bottom-most board y position

function layoutFan(folders) {
  const result = [];
  let remaining = folders.slice();
  let ring = 0;

  while (remaining.length > 0) {
    const count = Math.min(remaining.length, MAX_PER_RING);
    const radius = FIRST_RING_RADIUS + ring * RING_GAP;
    // Spread boards along the arc, with vertical offset so they don't overlap
    const arc = RING_ARC;
    for (let i = 0; i < count; i++) {
      // Distribute evenly; for 1 board center it, for many spread across arc
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = -arc / 2 + t * arc;
      const x = radius * Math.sin(angle);
      // Vertical: bottom boards lower, top boards higher
      // For 1 board: center
      // For 2 boards: left lower, right higher
      // For 3 boards: left lower, center middle, right higher
      const yOffset = count === 1 ? 0 : (t - 0.5) * 0.5; // ±0.25
      const y = BASE_Y + ring * Y_PER_RING + yOffset;
      // Slight Z stagger to break the overlap: middle board closer to camera
      const zOffset = count === 1 ? 0 : -Math.abs(t - 0.5) * 0.15;
      const z = radius * Math.cos(angle) + zOffset;
      result.push({
        folder: remaining.shift(),
        position: [x, y, z],
      });
    }
    ring++;
  }

  return result;
}

/**
 * Compute a Y position offset to vertically center all boards in the camera's view.
 * Returns the negative of the average board Y so the group shifts down.
 */
function computeGroupOffsetY(positions) {
  if (positions.length === 0) return 0;
  const maxY = Math.max(...positions.map((p) => p[1]));
  // Shift down so maxY lands at the visual top quarter of the screen
  return Math.max(0, maxY - 1.4);
}

export default function Signpost({ folders, onSelectFolder }) {
  const emptyMessages = [
    '在这里添加你的第一个书签',
    '在书签栏创建文件夹',
    '然后回到这里',
  ];

  if (!folders || folders.length === 0) {
    // Show empty-state boards in a small fan
    const empty = emptyMessages.map((msg, i) => ({ id: `empty-${i}`, name: msg }));
    const laid = layoutFan(empty);

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

  const laid = layoutFan(folders);

  return (
    <group position={[1.0, 1.75, 0]}>
      {/* Pole - non-interactive so clicks pass through to signboards */}
      <mesh position={[0, 0, 0]} castShadow raycast={() => null}>
        <cylinderGeometry args={[0.12, 0.15, 3.5, 8]} />
        <meshToonMaterial color="#a0724a" />
      </mesh>

      {/* Fan-arranged signboards */}
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
