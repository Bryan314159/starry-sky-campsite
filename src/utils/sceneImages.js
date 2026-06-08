/**
 * Scene 1 background image catalog.
 *
 * Task 2.24 — popup 手动选图（精简版）
 *
 * 简化决策：本期只挂 1 张主图。`altImages` 占位（暂留空），2.24 之后
 * 可逐步加 alt-1 / alt-2 等以提供多图选择。
 *
 * 图片路径必须以 `/scenes/` 开头（public/scenes/ 下的静态资源），
 * 以便 BackgroundImage 的 `<img>` / TextureLoader 能从 web_accessible
 * 资源或 chrome-extension:// 协议下加载。
 *
 * 同步约束：当 altImages 增多时，main.jsx 读取 chrome.storage 后
 * 需校验 URL 是否在 SCENE_IMAGES 列表里（防止被注入恶意 URL）。
 */
export const SCENE_IMAGES = [
  {
    id: 'campsite-bg',
    url: '/scenes/campsite-bg.webp',
    name: '黄昏湖畔',
    description: '默认主图',
  },
  // 占位 alt 图（本期为空；2.24 之后可加 alt-1.webp / alt-2.webp）
  // {
  //   id: 'campsite-bg-alt-1',
  //   url: '/scenes/campsite-bg-alt-1.webp',
  //   name: '备用图 1',
  //   description: '待添加',
  // },
];

export const DEFAULT_BG_IMAGE = SCENE_IMAGES[0].url;

/**
 * 校验 URL 是否在合法列表里（防止 chrome.storage 被外部注入恶意 URL）
 */
export function isValidImageUrl(url) {
  return SCENE_IMAGES.some((img) => img.url === url);
}
