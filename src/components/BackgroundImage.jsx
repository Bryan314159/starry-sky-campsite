import { useAppContext } from '../context/AppContext';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

/**
 * Scene 1 full-screen background image.
 *
 * Task 2.22 — BackgroundImage (ADR-004 方案 C 落地)
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
 * Geometry: 32 × 18 PlaneGeometry at z = -10. With camera at
 * (0, 1.5, 5.0) and FOV 60 (vertical), this covers the viewport at 16:9
 * with ~4% overhang for safe-area margin.
 */
const PLANE_W = 32;
const PLANE_H = 18;
const PLANE_Z = -10;
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
