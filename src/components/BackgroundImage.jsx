import { useAppContext } from '../context/AppContext';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

/**
 * Scene 1 full-screen background image.
 *
 * Task 2.22 — BackgroundImage (ADR-004 方案 C 落地)
 * Task 2.25 — 视觉回归：plane 推远到 z=-15（让 3D 浮层有"坐在图上"的中景空间）
 *
 * Replaces the previous pure-3D environment composition:
 *   - SkyDome (day)  → DELETED
 *   - BackgroundLayers (mountains/lake/mist/trees) → DELETED
 *   - Ground (grass plane) → DELETED from Campsite (kept for StarrySky)
 *   - GrassTufts → DELETED
 *   - ForegroundFlowers → DELETED
 *   - ScorchMark → DELETED
 *   - <fog> → REMOVED
 *   - ambient/directional/hemisphere lights → weakened (image already has light)
 *
 * The image is loaded by useBackgroundImage hook from
 * AppContext.state.bgImage (default: /scenes/campsite-bg.webp).
 *
 * If the image fails to load (SP1.1.1), we render a flat warm color
 * matching art-style.md §4.3 scene-1 palette as graceful degradation.
 *
 * Geometry: 64 × 36 PlaneGeometry at z = -15. With camera at
 * (0, 1.5, 5.0) and FOV 60 (vertical), this covers the viewport at 16:9
 * with generous safe-area margin. Larger than strictly needed (z=-15 is
 * 20m from camera) so the image stays in the far background and 3D
 * overlays "sit" on it at middle distance (z=0~2).
 */
const PLANE_W = 64;
const PLANE_H = 36;
const PLANE_Z = -15;
const PLANE_Y = 0.5; // slight upward offset to center horizon at 1/3
const FALLBACK_COLOR = '#d4b896'; // warm dusk color from art-style.md §4.3

export default function BackgroundImage() {
  const { state } = useAppContext();
  const { texture, isLoading, error } = useBackgroundImage(state.bgImage);

  // SP1.1.1 — graceful degradation: solid color fallback on load failure
  if (error) {
    return (
      <mesh position={[0, PLANE_Y, PLANE_Z]} raycast={() => null}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <meshBasicMaterial color={FALLBACK_COLOR} toneMapped={false} />
      </mesh>
    );
  }

  // Skip rendering until texture is ready — first frame shows transparent
  // canvas briefly (200ms or less), then snaps to the loaded image
  if (isLoading || !texture) {
    return null;
  }

  return (
    <mesh position={[0, PLANE_Y, PLANE_Z]} raycast={() => null}>
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
