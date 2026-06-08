import { useAppContext } from '../context/AppContext';
import BackgroundImage from '../components/BackgroundImage';
import Path from '../components/Path';
import Campfire from '../components/Campfire';
import Signpost from '../components/Signpost';
import Fireflies from '../components/Fireflies';
import SkyBirds from '../components/SkyBirds';

/**
 * Scene 1 — Campsite (signposts) — ADR-004 方案 C 落地版
 *
 * Task 2.22 — 大幅重写：删除纯 3D 环境组件，改用静态图作背景
 *
 * 之前 (v2.11/2.12)：
 *   <fog> + SkyDome(day) + 5 个环境组件 + 强灯光
 *   试图用 3D 代码还原参考图
 *
 * 现在 (v3)：
 *   BackgroundImage 静态图作天空+地面
 *   弱化灯光（图片自带光感）
 *   3D 浮层：Path / Campfire / Signpost / Fireflies / SkyBirds
 *
 * Lighting 调整（图片是"画"，灯光是"画框"）：
 *   - ambientLight: 0.5 → 0.4（弱化）
 *   - directionalLight: 1.3 → 0.7（避免 3D 浮层过亮抢戏）
 *   - hemisphereLight: 0.4 → 0.2
 *   - pointLight (营火): 2.2 (保留) —— 3D 营火发热需保留
 */
export default function Campsite() {
  const { state, dispatch } = useAppContext();

  const handleSelectFolder = (folder) => {
    dispatch({ type: 'SELECT_FOLDER', payload: folder });
  };

  return (
    <>
      <BackgroundImage />
      <SkyBirds />

      <ambientLight intensity={0.4} color="#fff5e0" />
      <directionalLight
        position={[5, 7, 3]}
        intensity={0.7}
        color="#ffe0b0"
      />
      <hemisphereLight args={['#f5c8a0', '#5e7a45', 0.2]} />

      <Path />
      <Campfire />
      <Signpost
        folders={state.folders}
        onSelectFolder={handleSelectFolder}
      />
      <Fireflies />
    </>
  );
}
