# 阶段 2 — 数据层 + 场景一

**状态：** 🔄 进行中（17/22 已完成）
**日期：** 2026-06-03 — 2026-06-08
**任务数：** 22（含 2.14-2.25 ADR-004 方案 C 新增 9 个）
**已完成：** 17

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

---

## ADR-004 方案 C — 场景一"参考图水准"升级（2.14-2.25）

**触发：** ADR-003 路线"用 1 周纯 3D 升级达到参考图水准"成本过高，**ADR-004** 改为"静态图 + 3D 浮层"（方案 C）。9 个新任务 (2.14-2.20, 2.21-2.25)；原 2.19/2.20 删除，新增 2.21-2.25。

详细计划见 `doc/plan/new/adr-003-adr-004-spec-md-scene1-photo-plus-3d-overlay.md`。

### 任务 2.14 — Outlines 描边包裹 3D 浮层 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08

**目标：** 6 个保留下来的 3D 浮层元素加 screenspace 描边，统一 toon 描边感

**改动文件：**
- `src/components/Signpost.jsx`（SignpostPole 4 处 + SignpostBird）
- `src/components/SignBoard.jsx`
- `src/components/Campfire.jsx`（StoneRing 7 stones + Logs 2 + FlameCluster 4）
- `src/components/Path.jsx`
- `src/components/SignpostBird.jsx`（body 2 planes + wing）
- `src/components/SkyBirds.jsx`（4 birds）

**复用：** drei `<Outlines screenspace>` — 0 bundle 增量

**验证：** build 仍 < 300ms；视觉描边统一

### 任务 2.15 — MeshToonMaterial + 3 阶 gradientMap ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08

**目标：** 3D 浮层 toon 色阶化（与图片 toon 风格统一）

**新增：** `src/utils/toonGradientMap.js`（DataTexture [60,160,240] + NearestFilter singleton）

**改动：** Signpost / SignBoard / Campfire / Path 全部 mesh → meshToonMaterial + gradientMap

**验证：** build < 300ms；tests 28/28 通过；2-3 阶色阶视觉确认

### 任务 2.16 — 场景切换相机阻尼过渡 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08

**目标：** 场景一 ↔ 场景二 切换 1.5-2.0s 阻尼

**实现：** `src/App.jsx` `CameraController` 用 useFrame + 自定义指数阻尼 `alpha = 1 - exp(-λ·dt)`，λ=2.0 → ~95% in 1.5s

**不复用 maath：** maath 没装；自定义实现 ~10 行更轻量

**验证：** 阻尼过渡顺畅（视觉）

### 任务 2.17 — 评估 SignBoard drei Text 替代
**状态：** ✅ 已完成（**决策：保留 CanvasTexture**）| **日期：** 2026-06-08

**决策原因：**
1. 0 外部资源原则 — 不引入 CDN CJK 字体 URL
2. 首帧 < 500ms 硬性指标 — CDN 字体加载抖动
3. 现有 CanvasTexture 已有 wobble border + 钉子 + 墨晕
4. CJK 字体文件大（~1-3MB）

**未来迁移路径** 已记录在 SignBoard.jsx 注释（用 `@fontsource/zcool-kuaile` CDN 字体）

### 任务 2.18 — 评估 Fireflies drei Sparkles 替代
**状态：** ✅ 已完成（**决策：保留自定义**）| **日期：** 2026-06-08

**决策原因：**
1. 失去"暖金 + 闪烁"手作感 — drei Sparkles 是点状光斑
2. art-style.md §6.2 "万物有灵的诗意" 强调手工细节
3. 不加 Outlines（萤火虫是"光点"，描边会变"硬边小石头"）
4. 不改 toon 化（meshBasicMaterial 是"自发光"正确选择）
5. 性能：14 粒子 < drei Sparkles 默认 100 个

**未来迁移路径** 已记录在 Fireflies.jsx 注释

### 任务 2.21 — 准备 campsite-bg.webp 主图 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08 | **Commit：** `83e157b`

**目标：** 用户最新提供的参考图 → `public/scenes/campsite-bg.webp`

**执行：**
- 校验 3840×2160 16:9 ✓
- 转 WebP 质量 85 → 140KB
- 视觉锚点核对（远山 + 湖面 + 营火 + 小径）✓

**验证：** Chrome 加载扩展 → 看到新图；build 仍 < 300ms

### 任务 2.22 — BackgroundImage 组件 + 删除环境 3D 元素 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08 | **Commit：** `5d3ad89`

**新增：**
- `src/components/BackgroundImage.jsx`（32×18 plane @ z=-10, y=0.5，sRGBColorSpace）
- `src/hooks/useBackgroundImage.js`（TextureLoader + 错误降级 + cancelled cleanup）

**AppContext 扩展：**
- + `bgImage: '/scenes/campsite-bg.webp'` 初始 state
- + `SET_BG_IMAGE` action（任务 2.24 持久化用）

**删除（图片替代）：**
- `BackgroundLayers.jsx` / `GrassTufts.jsx` / `ForegroundFlowers.jsx` / `ScorchMark.jsx`

**保留但不再 Campsite 用：** `SkyDome.jsx`（拆为 night-only，给 StarrySky 用）、`Ground.jsx`（StarrySky 用）

**Campsite.jsx 大幅重写：**
- 删 <fog>
- ambientLight 0.5→0.4, directional 1.3→0.7, hemisphere 0.4→0.2
- 营火 pointLight 2.2 保留

**降级策略**（SP1.1.1）：图片加载失败 → `#d4b896` 暖色纯色 + console.warn

**验证：** build 430ms / tests 28/28 通过 / bundle -6.46KB

### 任务 2.23 — 标定 3D 元素位置 ⭐ 关键 ⭐ 详细
**状态：** ✅ 已完成 | **日期：** 2026-06-08 | **Commit：** `84ec7a7`

**目标：** 3D 浮层精确对位图片视觉锚点（图像坐标 → 3D 坐标映射）

**新增：** `src/config/scene1Calibration.js` (83 行) — 单源真相

**标定值（基于 3840×2160 参考图 + 相机 [0,1.5,5.0]→[0,1.0,-2.0] FOV 60）：**

| 元素 | 旧值 | 新值 | 屏幕位置 |
|------|------|------|---------|
| Signpost | `[1.6, 1.78, -0.2]` | `[1.4, 1.78, 0.0]` | 右 ~70% |
| Campfire | `[0, 0, 1.5]` | `[-1.8, 0, 1.0]` | 左 ~19% |
| Path startZ | 4.0 | 3.5 | 起点更近相机 |
| Path centerline | `-0.7sin + 0.3t` | `-0.4sin + 0.2t` | 轻微左偏再回正 |
| Fireflies range | y[0.4,2.6] | y[0.6,2.8] | 集中在上半 |
| SkyBirds yRange | [3.0, 4.4] | [2.6, 3.8] | 远山上空 |

**5 组件改为读 SCENE1_CALIBRATION：**
- `Signpost.jsx` / `Campfire.jsx` / `Path.jsx` / `Fireflies.jsx` / `SkyBirds.jsx`

**Seeded RNG：** Fireflies `Math.random()` → mulberry32（重渲染稳定，不再抖动）

**SignpostBird 不动：** 嵌套在 SignpostPole 内部，自动跟随

**视觉回归截图：** `doc/rendering/scene1-v3-calibration.png`（供 2.25 对比）

**dev tool：** `scripts/snap-calibration.mjs`（Playwright + Python http.server）

**验证：** build 383ms / tests 28/28 通过 / 截图视觉确认位置对位

**已知遗留（按用户决策，2.25 处理）：**
- toon 材质在弱光下板背面纯黑 → 视觉回归时调 ambient/directional 强度

## 阶段产出
- 完整的 chrome.bookmarks → 场景一 R3F 渲染管线
- 场景一"治愈感"画面（2.11 + 2.12 双重打磨）
- 1 份场景设计文档（doc/scene-design.md）
- 1 份灵感研究文档（doc/inspiration-research.md）
- **场景一"参考图水准"v3 升级**（2.14-2.23）：
  - 静态图 + 3D 浮层架构（BackgroundImage + 5 个 3D 浮层）
  - toon 描边 + 3 阶 gradientMap（art-style.md §8 风格）
  - 相机阻尼过渡
  - 3D 浮层标定（scene1Calibration.js）
  - 视觉回归截图

## 验证
- ✅ `npm run build` ~383ms
- ✅ `npm test` 28/28 passed
- ✅ `npx vite` dev server 启动正常
- ✅ Chrome 加载 dist/ 无运行时错误
- ✅ Playwright 截图脚本可生成视觉回归图

## 备注
- 2.5 书签变更监听延后到迭代阶段
- 2.11 / 2.12 是项目画风落地的**里程碑**，未来所有视觉任务以此为基准
- 2.13 灵感研究为未来可借鉴技法提供清单（drei `<Outlines>` / 颜色量化 / Octopath HD-2D 等）
- 2.21-2.23 是 **ADR-004 方案 C 关键路径**，把"纯 3D 还原图"改为"图 + 3D 浮层"
- 2.23 标定是方案 C 的**核心成本**（0.5-1 天手工标定），已通过 `scene1Calibration.js` 单源化
- 2.24 / 2.25 待开始 — 2.24 是 popup 选图，2.25 是视觉回归验收
