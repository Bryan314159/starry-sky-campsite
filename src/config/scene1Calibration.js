/**
 * Scene 1 calibration — 3D overlay positions aligned to campsite-bg.webp
 *
 * Task 2.23 — 标定 3D 浮层与背景图视觉锚点对位
 *
 * 背景图：public/scenes/campsite-bg.webp (3840×2160, 16:9)
 * 相机：   position [0, 1.5, 5.0] → lookAt [0, 1.0, -2.0], FOV 60
 *
 * 坐标系约定：
 *   +x 右 / +y 上 / +z 朝相机方向（-z 进入场景）
 *
 * 图像视觉锚点（v3 标定）：
 *   - 太阳（焦点）     ~x=50%,  y=52%    → 画面中心偏下
 *   - 地平线           ~y=66%            → 天空/陆水分界
 *   - 营火痕迹         ~x=19%,  y=63%    → 红色斑点 + 焦痕
 *   - 路径起点         ~x=37%,  y=97%    → 泥土小径入画
 *   - 路径终点         ~x=50%,  y=67%    → 中央地平线消失
 *   - 左侧枯树         ~x=7%,   y=54%    → 远景装饰
 *   - 右侧山丘         ~x=96%,  y=67%    → 远景装饰
 *
 * 验证：Chrome 加载扩展 → 3D 浮层与图像视觉锚点重合
 *       截图保存到 doc/rendering/scene1-v3-calibration.png（任务 2.25 对比）
 */
export const SCENE1_CALIBRATION = {
  // 背景图平面（与 BackgroundImage.jsx 同步）
  background: {
    width: 32,
    height: 18,
    z: -10,
    y: 0.5,
  },

  // 路牌柱 —— 画面右侧 ~70% 宽位置（图像右半干净草地，无视觉冲突）
  // 柱高 3.7m，柱底 y=0（地面），柱顶 y=3.7；GROUP 在 y=1.78 居中
  signpost: {
    groupPosition: [1.4, 1.78, 0.0],
    poleHeight: 3.7,
    poleYOffset: 0,
  },

  // 营火 —— 画面左前 ~19% 宽位置（与图像中红色营火痕迹对齐）
  // z=1.0 距相机 4m，在地面略上，3D 营火发热光晕染附近草地
  campfire: {
    groupPosition: [-1.8, 0, 1.0],
    flameYOffset: 0.18,
    pointLightDistance: 4.0,
  },

  // 小路 —— 跟随图像中可见的泥土小径
  // 起点底部中央偏左（~37% 宽），中段左偏，终点中央地平线
  // 半宽略小于图上小径（避免 3D 路径"压"在图上小径上）
  path: {
    startHalfWidth: 0.9,
    endHalfWidth: 0.15,
    startZ: 3.5,
    length: 14,
    segments: 18,
    // 中心线轻微左偏再回正：t=0 → 0, t=0.5 → -0.4 (左), t=1 → +0.2
    centerlineOffset: (t) => -0.4 * Math.sin(t * Math.PI) + 0.2 * t,
  },

  // 萤火虫 —— 集中在画面上半部（与图像中暖色雾带呼应）
  // 14 颗，xz 范围比之前略收（避免飘到画面边缘外）
  fireflies: {
    count: 14,
    range: { x: [-3.5, 3.5], y: [0.6, 2.8], z: [-3, 1.5] },
    seed: 1729,
  },

  // 远景飞鸟 —— 图像上方远山前（z=-7~-5 远离相机）
  // y 2.6~3.8 对应画面 y 30%~50%（远山上空）
  skyBirds: {
    count: 4,
    yRange: [2.6, 3.8],
    zRange: [-7, -5],
    xRange: [-6, 6],
    speed: 0.15,
    seed: 314159,
  },

  // 栖柱小鸟 —— 在 SignpostPole 内部 position=[0, 1.92, 0]
  // 自动跟随 signpost.groupPosition，无需标定
};
