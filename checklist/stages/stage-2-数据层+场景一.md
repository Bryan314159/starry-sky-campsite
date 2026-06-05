# 阶段 2 — 数据层 + 场景一

**状态：** 🔄 进行中（12/13 已完成）
**日期：** 2026-06-03 — 2026-06-05
**任务数：** 13
**已完成：** 12

## 目标
实现场景一的完整功能 + 数据层：从 chrome.bookmarks API 解析 → React 状态 → R3F 营地场景。
场景一也是项目"治愈感画风"的**第一次**落地实验（2.11 / 2.12 反复打磨）。

## 任务清单

### 任务 2.1 — utils/bookmarks.js 解析函数
**状态：** ✅ 已完成 | **日期：** 2026-06-03
chrome.bookmarks API → 应用内部数据结构的解析函数（扁平化顶层文件夹及其直接子项，不深递归）。单元测试覆盖。

### 任务 2.2 — useBookmarks hook
**状态：** ✅ 已完成 | **日期：** 2026-06-03
React hook 封装：useEffect 调用 chrome.bookmarks.getTree，setState folders。异步加载 / 错误处理覆盖。

### 任务 2.3 — AppContext 状态管理
**状态：** ✅ 已完成 | **日期：** 2026-06-03
React Context 全局状态：scene（campsite / starry）/ selectedFolder / folders。AppProvider / useAppContext / dispatch actions。

### 任务 2.4 — Mock 数据
**状态：** ✅ 已完成 | **日期：** 2026-06-03
src/utils/mockBookmarks.js — 3-5 个文件夹 + 若干书签的样本数据。chrome.bookmarks 不可用时回退。

### 任务 2.5 — 书签变更监听
**状态：** ⬜ 待开始 | **日期：** —
监听 chrome.bookmarks.onChanged / onCreated / onRemoved 事件，自动刷新 UI。**延后到迭代阶段**（MVP 不含）。

### 任务 2.6 — Ground + Path + SkyDome(day) 基础场景
**状态：** ✅ 已完成 | **日期：** 2026-06-03
搭建场景一的最小可视图：草色地面 + 棕色小径 + 蓝色天空。三个 toon plane + 基础光照。

### 任务 2.7 — Signpost + SignBoard + CanvasTexture 文字
**状态：** ✅ 已完成 | **日期：** 2026-06-03
木质路牌柱 + 多块方向指示牌 + 画布渲染的文件夹名文字。Signpost 圆柱 + SignBoard CanvasTexture。

### 任务 2.8 — 场景一光照调试
**状态：** ✅ 已完成 | **日期：** 2026-06-03
ambient 0.4 / directional 1.2 / hemisphere 0.3。路牌正面被暖光照亮，地面 / 天空不被压暗。

### 任务 2.9 — 点击指示牌切换场景
**状态：** ✅ 已完成 | **日期：** 2026-06-03
SignBoard onClick → onSelectFolder → dispatch SELECT_FOLDER → state.scene = 'starry'。GWT SP1.x 覆盖。

### 任务 2.10 — 场景画面设计文档 + 构图调整
**状态：** ✅ 已完成 | **日期：** 2026-06-04
编写 `doc/scene-design.md`（~200 行）：构图原则（三分法，天 35% / 地 65%）/ 视觉层级 / 相机设定 / 元素布局 / 光照 / 色彩方案 / 空状态。让所有后续画面调整有"可被审查"的标准。

### 任务 2.11 — 场景一画面升级（参考图驱动）⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-05 | **Commit：** `a3e8057`

**输入：** 用户提供的「木质路牌 + 篝火 + 远山湖面 + 雾气」参考图
**目标：** 以 art-style.md 为基准，把场景一从「极简原型」升级到「氛围感画面」

**改动文件：**
- `src/components/SkyDome.jsx` — 重写：ShaderMaterial 三段渐变 + 水彩 wash
- `src/components/Ground.jsx` — 重写：带草地纹理（草丝 / 草簇 / 野花 / 赭石土点）
- `src/components/Path.jsx` — 重写：ShapeGeometry 不规则土路 + 泥土斑驳
- `src/components/BackgroundLayers.jsx` — 新增：远山 + 湖面 + 雾带 + 树丛
- `src/components/Campfire.jsx` — 新增：石环 + 炭木 + 4 层 toon 火焰 + 呼吸动画
- `src/components/Signpost.jsx` — 重写：木纹 + 桩基 + 木球帽，位置右移
- `src/components/SignBoard.jsx` — 重写：木纹底 + wobble 边框 + 钉头 + hover 抬升
- `src/scenes/Campsite.jsx` — 集成：fog 雾效 + 暖金傍晚光照

**画风对照（art-style.md §8）：** 8 项全部对齐（低饱和 / 平涂 / 描边 / 前景简背景精 / 水彩 / 留白 / 萌感 / 手工文字）

**验证：** `npm run build` 270ms · `npm test` 28/28 通过

### 任务 2.12 — 场景一氛围感深化（细节追加）⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-05 | **Commit：** `f0ee76a`

**目标：** 在 2.11 基础上追加 9 项细节，呼应参考图核心元素与 art-style.md §6.2「万物有灵的诗意」

**新增 (6)：**
- `src/components/Fireflies.jsx` — 14 个萤火虫/余烬（暖金 sphere + halo sprite + 闪烁呼吸）
- `src/components/SignpostBird.jsx` — 路牌柱顶手绘小鸟（canvas + 双十字 plane + 翅膀拍动）
- `src/components/ForegroundFlowers.jsx` — 24 雏菊 + 14 毛茛，seeded 散布在路两侧
- `src/components/GrassTufts.jsx` — 140 株 InstancedMesh 草丛 + 风吹摆动
- `src/components/SkyBirds.jsx` — 4 只远景飞鸟 V 形剪影 + 横向漂移
- `src/components/ScorchMark.jsx` — 篝火下方地面灼痕

**修改 (5)：**
- Path：加曲线中心线（中段偏左 0.7m，末端偏右 0.3m）
- BackgroundLayers：MistBand 漂移 `map.offset.x = t * 0.006`
- Campfire：新增 pointLight (intensity 2.2, distance 4.5, #ffb168) 暖光晕染
- Signpost：集成 SignpostBird
- Campsite：集成 8 个新组件

**画风深化对照：**
- §3.1 粗圆描边 ✅ 飞鸟/小鸟 silhouette 圆润
- §6.2 万物有灵的诗意 ✅ 萤火虫/草丛/雾带/鸟翅/火焰/鸟 都在动
- §7.1 暖色傍晚 ✅ 篝火 pointLight 暖色晕染
- §5.1 层次丰富 ✅ 草丛 + 野花增加前景层次

**验证：** build 239ms / tests 28/28 / dev server 正常

### 任务 2.13 — 灵感研究 · 同类项目调研 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-05 | **Commit：** `0aa170a`

**目标：** 开拓视野，研究其他人在三类项目上的实现方式，整理可借鉴的范式与技法清单

**3 维度调研：**
- A. 艺术化 / 3D new-tab 扩展 (6 项目)：Tabliss / Momentum / Bonjourr / Bruno Simon / Active Theory / Awwwards
- B. 书签 / 收藏夹可视化 (12 项目)：**Are.na** / **nightTab** / Homer / Heimdall / Raindrop.io / Pocket / BookmarksMap / TimeMap / HistoryMap / **Lost at Night** / Session Buddy / Flame
- C. Three.js / R3F 手绘风技法 (10 技法)：MeshToonMaterial+gradientMap / drei `<Outlines>` / OutlinePass / 域扭曲 fBm / 颜色量化 + Bayer dither / canvas NearestFilter / Octopath HD-2D / billboard impostor / inverted-hull 等

**产出：** `doc/inspiration-research.md`（~400 行）+ 8 个 ROI 排序的技法 + 3 批落地建议

**用户决策：**
- ✅ 写入 doc/ 并 git commit
- ✅ 本次不立刻实施任何技法（留作未来灵感库）

## 阶段产出
- 完整的 chrome.bookmarks → 场景一 R3F 渲染管线
- 场景一"治愈感"画面（2.11 + 2.12 双重打磨）
- 1 份场景设计文档（doc/scene-design.md）
- 1 份灵感研究文档（doc/inspiration-research.md）

## 验证
- ✅ `npm run build` ~280ms
- ✅ `npm test` 28/28 passed
- ✅ `npx vite` dev server 启动正常
- ✅ Chrome 加载 dist/ 无运行时错误

## 备注
- 2.5 书签变更监听延后到迭代阶段
- 2.11 / 2.12 是项目画风落地的**里程碑**，未来所有视觉任务以此为基准
- 2.13 灵感研究为未来可借鉴技法提供清单（drei `<Outlines>` / 颜色量化 / Octopath HD-2D 等）
