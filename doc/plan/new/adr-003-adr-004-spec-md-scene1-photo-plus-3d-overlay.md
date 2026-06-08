# 场景一设计 — 静态图 + 3D 浮层（ADR-004 方案 C 落地）

**日期：** 2026-06-08
**计划范围：** 阶段 2 任务 2.14–2.25（场景一"参考图水准"升级）
**基于：** ADR-003（参考图驱动）→ ADR-004（方案 C 取代 ADR-003 的纯 3D 路线）· spec.md v0.2.0 · scene1-background-image-requirements.md v1.0 · 用户最新提供的参考图（黄昏湖畔·营火·远山·引导小径）
**颗粒度：** 架构 + 任务分解（不展开精确 3D 坐标，留给任务 2.23 标定）

---

## 一、Context

### 1.1 决策链

| 文档 | 决策 |
|------|------|
| **ADR-003**（2026-06-05） | 场景一"用 1 周纯 3D 升级达到参考图水准"——7 个新任务 2.14–2.20 |
| **ADR-004**（2026-06-05，**取代 ADR-003**） | "为什么要用 3D 代码去还原一张图？"——改为**静态图 + 3D 浮层**（方案 C） |
| **spec.md v0.2.0** | 同步 7 个新 GWT 场景（SP1.1.1, SP1.7–SP1.11） |
| **用户最新输入** | 提供了一张**完美匹配** ADR-004 需求 H1-H7 + C1-C6 的参考图（黄昏金·湖边·远山·营火·小径·中央留空） |

### 1.2 用户决策（已确认）

1. **图片来源**：用户最新发送的参考图 → 直接作为 `public/scenes/campsite-bg.webp`（主图，任务 2.21）
2. **多图范围**：本轮**仅 1 张主图 + popup 手动选图**；**不做**每日换（2.24 简化为 popup 切换 + 持久化到 chrome.storage）
3. **计划颗粒度**：架构 + 任务分解（不到 3D 坐标层级；坐标在任务 2.23 标定阶段产出）

### 1.3 ADR-004 的"删除 vs 保留"

| ADR-003 任务 | ADR-004 处置 | 原因 |
|:---:|------|------|
| 2.14 Outlines 描边 | ✅ **保留** | 3D 浮层需要描边保持 toon 感 |
| 2.15 toon gradientMap | ✅ **保留** | 3D 浮层需 toon 化 |
| 2.16 相机阻尼 | ✅ **保留** | 场景切换体验 |
| 2.17 drei `<Text>` | ✅ **保留** | 指示牌文字立体 |
| 2.18 drei `<Sparkles>` | ✅ **保留** | 萤火虫替代 |
| 2.19 加湖面 | ❌ **删除** | 参考图已有湖面 |
| 2.20 远景 billboard | ❌ **删除** | 参考图已有远景 |
| **2.21** 图片资源 | 🆕 **新增** | 准备 `campsite-bg.webp` |
| **2.22** BackgroundImage 组件 | 🆕 **新增** | 替换 SkyDome+Ground+BackgroundLayers |
| **2.23** 3D 元素标定 | 🆕 **新增** | 关键成本：手工标定 |
| **2.24** popup 选图（不含每日换） | 🆕 **新增**（精简） | Are.na 风格的"手动选图" |
| **2.25** 视觉回归 | 🆕 **新增** | 验收 |

净变化：任务 7 → 10（-2 +5，2.24 范围精简）。

---

## 二、场景一架构（方案 C）

### 2.1 视觉层级

```
┌────────────────────────────────────────────┐
│  BackgroundImage (z = -10)                 │  ← 静态图（占位新标签页视口的 100%）
│  public/scenes/campsite-bg.webp            │
│                                            │
│   3D 浮层 (z = -1 ~ 1.5):                  │
│     · Path         (z ≈ 0.5, 引导线)        │
│     · Campfire     (z ≈ 1.0, 浮在图上营火处) │
│     · Signpost+SB  (z ≈ 1.5, 视觉焦点)      │
│     · Fireflies    (z ≈ 1.0, 飘在画面中)    │
│     · SignpostBird (z ≈ 1.5, 栖于柱顶)      │
│     · SkyBirds     (z ≈ 0.8, 飞过画面)      │
│                                            │
│  HTML Overlay (z = ∞):                     │
│     · SearchBar  底部居中                   │
│     · Tooltip    hover 显示                 │
│     · ImagePicker  popup 选图               │
└────────────────────────────────────────────┘
```

### 2.2 与当前实现（2.11/2.12 后的纯 3D 方案）的对比

| 元素 | 当前（v2.11/2.12） | 方案 C（v3） | 理由 |
|------|:---:|:---:|------|
| **SkyDome (day)** | ✅ 启用 | ❌ **删除** | 图片做天空 |
| **Ground** | ✅ 启用 | ❌ **删除** | 图片里已有草地 |
| **BackgroundLayers**（远山/湖/雾/树）| ✅ 启用 | ❌ **删除** | 图片里已有 |
| **GrassTufts** | ✅ 启用 | ❌ **删除** | 图片里已有草丛 |
| **ForegroundFlowers** | ✅ 启用 | ❌ **删除** | 图片里已有花 |
| **ScorchMark** | ✅ 启用 | ⚠️ **决定保留或删除**（2.22 阶段）| 决定：保留（与图中营火痕迹位置一致时加强 3D 营火锚定） |
| **Path** | ✅ 启用 | ✅ **保留 + 重新标定** | 3D 引导线叠在图上小径上 |
| **Campfire** | ✅ 启用 | ✅ **保留 + 重新标定** | 浮在图中篝火痕迹上 |
| **Signpost + SignBoard** | ✅ 启用 | ✅ **保留 + 重新标定** | 移到画面中央（原 1/3 黄金点）|
| **Fireflies** | ✅ 启用（自定义）| ✅ **保留 → 改 drei `<Sparkles>`**（2.18）| 代码简化 |
| **SignpostBird** | ✅ 启用 | ✅ **保留** | 3D 浮层 |
| **SkyBirds** | ✅ 启用 | ✅ **保留** | 3D 浮层（飞过图上空）|
| **🆕 BackgroundImage** | — | ✅ **新增** | 任务 2.22 |
| **🆕 useBackgroundImage hook** | — | ✅ **新增** | 任务 2.22 |
| **🆕 ImagePicker (overlay)** | — | ✅ **新增** | 任务 2.24 |
| **🆕 scene1Calibration.js** | — | ✅ **新增** | 任务 2.23 标定配置 |

**删除/保留原则：**
- **删除** = 图片里**已经包含**的元素（避免双层渲染打架）
- **保留** = 图片里**没有的**元素（沉浸感核心 3D 浮层）
- **重新标定** = 元素还在，但 3D 坐标需重新对齐图片（不再是 §3.1 元素位置表里的旧值）

### 2.3 颜色 / 光照调整

| 项 | 旧值（v2.11/2.12）| 新值（v3）| 理由 |
|----|------|------|------|
| `<fog>` | `#e8d4b0, 8, 22` | **删除** | 图片不需 fog |
| `ambientLight` | 0.5, `#fff2d8` | **0.4, `#fff5e0`** | 弱化（图片自带光感）|
| `directionalLight` | 1.3, `#ffd49a` | **0.7, `#ffe0b0`** | 弱化（避免 3D 浮层过亮抢戏）|
| `hemisphereLight` | `#f5c8a0` / `#5e7a45` / 0.4 | **0.2** | 弱化 |
| `pointLight (营火)` | 2.2, 4.5, `#ffb168` | **保留** | 3D 营火发热需保留 |

> **新原则**：图片是"画"，灯光是"画框"——保证 3D 浮层"坐在"图上、不过度被照亮。

---

## 三、参考图与背景图策略

### 3.1 用户最新参考图（已确认作主图）

- **元素对齐**（与 `scene1-background-image-requirements.md §3` 完全匹配）：
  - ✅ 远山轮廓 + 中景湖面 + 雾带
  - ✅ 中央留空（营火位置）—— 完美供 3D 路牌 + 营火插入
  - ✅ 蜿蜒小径从底部边缘延伸到地平线 —— Path 3D 引导线叠浮
  - ✅ 暖色调（黄昏金）+ 低饱和度
  - ✅ 暖绿草地 + 木棕点缀
  - ✅ 无人物、无路牌、无文字

- **标定参考**（任务 2.23 阶段精细化，本计划不列具体坐标）：
  - 路牌插入点 ≈ 画面中央（不规则 1/3 黄金点——原 SPEC §3.1 的右 1/3 不再适用，因为图中央留空）
  - 营火痕迹 = 画面中央略前（小石圈）
  - 小路 = 从画面底部中心向中央延伸
  - 萤火虫 = 画面上 1/2
  - 远景飞鸟 = 画面上方远山前

### 3.2 资源处理

- 任务 2.21 流程：原图（用户提供）→ 检查尺寸/版权（H1-H7）→ 转 WebP（目标 ≤ 1.5MB）→ 放入 `public/scenes/campsite-bg.webp` → 视觉回归
- 暂**不**跑 image-01 重生成（用户决策：直接用参考图）
- `public/scenes/campsite-bg-alt-*.webp` 占位（暂留空，任务 2.24 popup 可加更多图，但本期默认只挂 1 张）

---

## 四、3D 浮层标定策略（任务 2.23 详细产出）

### 4.1 标定配置文件（新增）

新建 `src/config/scene1Calibration.js`：

```js
// 任务 2.23 标定的"硬坐标"
// 数据基于"参考图作主图"——切图时同步更新
export const SCENE1_CALIBRATION = {
  // 背景图平面参数
  background: {
    width: 32,         // PlaneGeometry width（覆盖视野）
    height: 18,        // 16:9
    z: -10,            // 最远
  },
  // 相机（与 App.jsx CAMPSITE_POS/LOOK 同步）
  camera: {
    position: [0, 1.6, 5.5],
    lookAt:   [0, 1.2, -1.0],
    fov:      60,
  },
  // 3D 浮层精确位置（具体值在 2.23 阶段产定）
  signpost:    { position: [0, 0, 0],  rotation: [0, 0, 0] },
  campfire:    { position: [0, 0, 0.6] },
  path:        { points: [[0, 0, 0], [0, 0, -1.5], /*...*/] },
  fireflies:   { count: 14, bounds: { x: [-3, 3], y: [0.5, 2.8], z: [-2, 1] } },
  birds:       { flightPath: [/*...*/] },
};
```

### 4.2 标定方法（2.23 任务内详细化）

1. 在 Chrome 加载未打包扩展
2. 用 dev mode 临时给 BackgroundImage 加 `wireframe` 或可视网格线
3. 拖动 3D 元素到与图匹配的位置，记录到 `SCENE1_CALIBRATION`
4. 关闭 debug，最终提交标定值

> **不在本计划展开坐标**——坐标是 2.23 的工作产物，颗粒度按用户决策不细化到此处。

---

## 五、任务分解（2.14–2.25）

### 5.1 任务依赖图

```
第一批（材质/描边 - 独立）
  2.14 Outlines 描边包裹前景 3D 元素
  2.15 MeshToonMaterial + 3 阶 gradientMap
        ↓
第二批（体验/立体感 - 依赖第一批）
  2.16 相机阻尼过渡（drei PerspectiveCamera + maath damp3）
  2.17 drei <Text> 替代 SignBoard 文字
  2.18 drei <Sparkles> 替代 Fireflies
        ↓
第三批（图片资源 + 标定 - 关键路径）
  2.21 准备图资源（用户提供 → 转 WebP）
  2.22 BackgroundImage 组件（删除 SkyDome/Ground/BackgroundLayers/GrassTufts/ForegroundFlowers）
  2.23 标定 3D 元素位置（产出 scene1Calibration.js）
  2.24 popup 手动选图（精简版：1 张 + chrome.storage 持久化）
  2.25 视觉回归（对照参考图逐项审查）
```

### 5.2 任务详细描述

#### 任务 2.14 — drei `<Outlines screenspace>` 包裹 3D 浮层

- **目标**：所有保留下来的 3D 浮层元素加 screenspace 描边，统一 toon 描边感
- **改动文件**：
  - `src/components/Signpost.jsx`（SignpostPole + SignBoard 容器）
  - `src/components/SignBoard.jsx`
  - `src/components/Campfire.jsx`（StoneRing + Logs + FlameCluster）
  - `src/components/Path.jsx`（可见 mesh + 描边厚度统一）
  - `src/components/SignpostBird.jsx`
  - `src/components/SkyBirds.jsx`
- **复用**：drei `<Outlines thickness={...} color="..." screenspace>` —— 已安装（`@react-three/drei 10.7`），0 bundle 增量
- **验证**：Canvas 截图视觉确认描边；build < 300ms
- **ROI**：⭐⭐⭐⭐⭐

#### 任务 2.15 — 全场景 `MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter`

- **目标**：3D 浮层 toon 色阶化（图片本身已是 toon 风格）
- **改动文件**：
  - **新增** `src/utils/toonGradientMap.js`（3 阶 gradientMap 工具：深 / 中 / 浅，每阶 1/3 宽度，NearestFilter）
  - `src/components/Signpost.jsx`（圆柱/底座/帽 toon 化）
  - `src/components/SignBoard.jsx`（plane 材质 toon 化）
  - `src/components/Campfire.jsx`（5 层 cone + 石 toon 化）
  - `src/components/Path.jsx`（dirt toon 化）
- **验证**：build < 300ms；28 tests 全过
- **ROI**：⭐⭐⭐⭐⭐

#### 任务 2.16 — 场景切换相机阻尼过渡

- **目标**：场景一 ↔ 场景二 切换 1.5-2.0s 阻尼
- **改动文件**：
  - `src/App.jsx`（CameraController 改用 drei `<PerspectiveCamera makeDefault>` + maath `damp3`）
  - 新建 `src/utils/dampCamera.js` 或直接 in-place
- **复用**：maath（已装）drei `<PerspectiveCamera>`
- **验证**：手动 Chrome 实测"瞬时"→"顺滑"
- **ROI**：⭐⭐⭐

#### 任务 2.17 — drei `<Text>` 替代 SignBoard DOM 文字

- **目标**：SignBoard 文字从 CanvasTexture 改为 drei `<Text>`，保持 3D 透视
- **改动文件**：
  - `src/components/SignBoard.jsx`（大幅重写：去掉 createTextTexture；用 `<Text>` 子组件）
- **决策点**：
  - 字体：drei `<Text font="...">` —— 选 `ZCOOL KuaiLe` 或 `Ma Shan Zheng`（手写感，符合 art-style.md §7.4）
  - 备份方案：若 drei Text 字体加载慢，保留 CanvasTexture 兜底
- **验证**：build 仍 < 300ms；tests 全过
- **ROI**：⭐⭐⭐

#### 任务 2.18 — drei `<Sparkles>` 替代 Fireflies

- **目标**：删除 `src/components/Fireflies.jsx`，用 drei `<Sparkles>` 替代
- **改动文件**：
  - `src/components/Fireflies.jsx`（**删除**）
  - `src/scenes/Campsite.jsx`（改为 `<Sparkles count={14} size={...} speed={...} color="#fff1c2" />`）
- **决策点**：
  - 保留自定义 Fireflies 而非用 drei Sparkles（**评估**：drei Sparkles 简化代码约 130 行，但**失去** "暖金 + 闪烁" 的手作感。倾向保留自定义，加 `<Outlines>` + gradientMap toon 化即可）
  - **最终决策（建议）**：保留自定义 Fireflies（手作感更贴合 art-style.md §6.2 万物有灵的诗意），drei `<Sparkles>` 改作 fallback 或不引入
- **ROI**：⭐⭐⭐（保留自定义方案 ROI 仍高）

#### 任务 2.21 — 准备图资源（用户提供）

- **目标**：将用户最新提供的参考图 → `public/scenes/campsite-bg.webp`
- **执行步骤**：
  1. 确认来源 / 版权（用户已在 AskUserQuestion 中确认使用）
  2. 校验尺寸（H1 ≥ 3840×2160，16:9，横向）
  3. 若 < 4K：AI 放大到 3840×2160（cubic / lanczos 优先；不放大则 fallback）
  4. 转 WebP（质量 85，目标 ≤ 1.5MB）
  5. 视觉锚点核对（参考 §5 视觉锚点清单）
  6. 放入 `public/scenes/campsite-bg.webp`
- **新增文件**：
  - `public/scenes/campsite-bg.webp`（**主图**）
  - `public/scenes/campsite-bg-alt-1.webp` 等（占位，本期无内容）
- **验证**：Chrome 加载扩展 → 看到新图；build < 300ms（图片 200ms 淡入）
- **ROI**：⭐⭐⭐⭐⭐

#### 任务 2.22 — BackgroundImage 组件 + 删除环境 3D 元素

- **目标**：新增 `BackgroundImage` 组件，作为场景一全屏底图；删除 SkyDome/Ground/BackgroundLayers/GrassTufts/ForegroundFlowers
- **改动文件**：
  - **新增** `src/components/BackgroundImage.jsx`（PlaneGeometry + CanvasTexture + sRGBColorSpace）
  - **新增** `src/hooks/useBackgroundImage.js`（加载 + 错误降级 + 持久化键）
  - `src/context/AppContext.jsx`（+ `bgImage` state 字段、`SET_BG_IMAGE` action）
  - `src/scenes/Campsite.jsx`（删除 SkyDome/BackgroundLayers/Ground/GrassTufts/ForegroundFlowers 引用；删除 fog；弱化灯光；新增 `<BackgroundImage />`）
  - **删除** `src/components/SkyDome.jsx`（不再被引用）
  - **删除** `src/components/Ground.jsx`
  - **删除** `src/components/BackgroundLayers.jsx`
  - **删除** `src/components/GrassTufts.jsx`
  - **删除** `src/components/ForegroundFlowers.jsx`
  - **删除** `src/components/ScorchMark.jsx`（与新图中央营火位置可能冲突；如保留，需重新标定）
  - `src/scenes/StarrySky.jsx`（确认仍引用 `SkyDome(night)` —— **不能删** `SkyDome` 的 night 变体；如果复用同一文件，改为 `SkyDome.jsx` 保留 night 变体，删 day 变体）
- **降级策略**（SP1.1.1）：图片加载失败 → 纯色背景（深暖色 `#d4b896`，与 art-style.md §4.3 对齐）+ 控制台 warn
- **验证**：
  - `npm run build` < 300ms
  - 28 tests 全过
  - Chrome 实测：图加载 → 3D 浮层位置"坐在"图上；图片失败 → 降级色
- **ROI**：⭐⭐⭐⭐⭐

#### 任务 2.23 — 3D 元素在背景图上的位置标定 ⭐ 关键

- **目标**：在 `src/config/scene1Calibration.js` 产出 3D 浮层精确位置
- **执行步骤**：
  1. 在 Chrome 加载未打包扩展
  2. dev mode 临时给 BackgroundImage 加 wireframe 网格（参考线）
  3. 拖动 Signpost / Campfire / Path / Fireflies / Birds 到与图匹配的位置
  4. 调整相机（position / lookAt / FOV）使画面与参考图整体一致
  5. 记录最终值到 `SCENE1_CALIBRATION`
  6. 关闭 debug，截图对照参考图
- **产出**：`SCENE1_CALIBRATION` 完整数据 + 视觉回归截图（保存到 `doc/rendering/scene1-v3-calibration.png`）
- **复用**：`src/components/Signpost.jsx` 已有 `layoutTwoColumns()` 算法；`src/components/Path.jsx` 已有 `buildPathShape()`
- **验证**：
  - 对照参考图逐项审查（SP1.8）
  - 8 项 art-style.md §8 清单通过
  - 首帧 < 500ms
- **ROI**：⭐⭐⭐⭐⭐（**关键成本**——0.5-1 天，方案 C 的核心成本）

#### 任务 2.24 — popup 手动选图（精简版）

- **目标**：在扩展 popup 中显示当前可用背景图列表，用户点击切换
- **改动文件**：
  - **新增** `popup.html` + `src/popup/main.jsx`（popup 入口，Vite 多页构建配置）
  - **新增** `src/overlays/ImagePicker.jsx`（popup UI：缩略图列表 + 当前选中）
  - `vite.config.js`（多页构建：newtab + popup）
  - `manifest.json`（+ `action.default_popup: "popup.html"`）
  - `src/context/AppContext.jsx`（+ `SET_BG_IMAGE` action 持久化到 `chrome.storage.local`）
  - `src/hooks/useBackgroundImage.js`（+ 监听 chrome.storage）
  - `public/manifest.json`（permissions 已含 `storage`，无新增）
- **精简决策**：
  - **不做**每日换（按日期 hash 选图）
  - **不做**多图轮播
  - **做**popup 列出 `public/scenes/` 下的所有图（本期 = 1 张）；用户点击 → 写入 `chrome.storage.local.bgImage` → 新标签页打开时读这个值
- **验证**：
  - popup 打开 → 看到缩略图
  - 点击 → 新标签页看到新图
  - 重启 Chrome → 仍展示新图（持久化）
- **ROI**：⭐⭐⭐⭐

#### 任务 2.25 — 视觉回归（对照参考图）

- **目标**：在 Chrome 中打开新标签页，逐项对照参考图
- **执行**：
  1. 加载未打包扩展 → 打开新标签页
  2. 对照参考图（用户最新提供的图）逐项审查：
     - [ ] 路牌/篝火/草地/远山/鸟/萤火虫/湖面 等元素位置与参考图一致
     - [ ] 整体氛围（暖色调、治愈感）匹配
     - [ ] 8 项 art-style.md §8 清单全部通过（toon 描边 + 3 阶色阶）
     - [ ] 首帧 < 500ms
  3. 通过 → 进入交付（任务 5.1 打包）
  4. 不通过 → 迭代 2.14-2.24（极小概率，因为用户已确认用参考图作主图）
- **产出**：
  - 视觉回归报告（`doc/rendering/scene1-v3-regression.md`）
  - 视觉回归截图（`doc/rendering/scene1-v3-final.png`）
- **ROI**：⭐⭐⭐⭐⭐

---

## 六、Critical Files

### 6.1 新增文件

| 文件 | 任务 | 用途 |
|------|:---:|------|
| `src/components/BackgroundImage.jsx` | 2.22 | 场景一全屏背景图 |
| `src/hooks/useBackgroundImage.js` | 2.22 | 图片加载 + 错误降级 + chrome.storage 监听 |
| `src/utils/toonGradientMap.js` | 2.15 | 3 阶 gradientMap 工具 |
| `src/config/scene1Calibration.js` | 2.23 | 3D 浮层标定配置 |
| `src/overlays/ImagePicker.jsx` | 2.24 | popup UI |
| `popup.html` + `src/popup/main.jsx` | 2.24 | popup 入口 |
| `public/scenes/campsite-bg.webp` | 2.21 | 场景一主图（用户提供）|
| `doc/rendering/scene1-v3-calibration.png` | 2.23 | 标定截图 |
| `doc/rendering/scene1-v3-final.png` | 2.25 | 视觉回归截图 |

### 6.2 修改文件

| 文件 | 任务 | 改动 |
|------|:---:|------|
| `src/scenes/Campsite.jsx` | 2.14/2.15/2.16/2.22 | 大幅重写：删除 5 个环境组件 + fog；弱化灯光；新增 BackgroundImage |
| `src/scenes/StarrySky.jsx` | 2.16 | 相机阻尼过渡 |
| `src/App.jsx` | 2.16/2.22 | CameraController 改 drei + maath；加 ImagePicker popup 触发 |
| `src/context/AppContext.jsx` | 2.22/2.24 | + `bgImage` state + `SET_BG_IMAGE` action + 持久化 |
| `src/components/Signpost.jsx` | 2.14/2.15 | + Outlines + toon；标定坐标从 `SCENE1_CALIBRATION` 读取 |
| `src/components/SignBoard.jsx` | 2.14/2.15/2.17 | + Outlines + toon + drei `<Text>` 替代 CanvasTexture |
| `src/components/Campfire.jsx` | 2.14/2.15 | + Outlines + toon；标定坐标从 `SCENE1_CALIBRATION` 读取 |
| `src/components/Path.jsx` | 2.14/2.15 | + Outlines + toon；标定 path 形状从 `SCENE1_CALIBRATION` 读取 |
| `src/components/SignpostBird.jsx` | 2.14 | + Outlines |
| `src/components/SkyBirds.jsx` | 2.14 | + Outlines |
| `src/components/Fireflies.jsx` | 2.14/2.15 | + Outlines + toon（保留自定义，**不**用 drei Sparkles）|
| `vite.config.js` | 2.24 | + popup 多页构建 |
| `manifest.json` | 2.24 | + `action.default_popup: "popup.html"` |
| `doc/design.md` §2.3/§2.5/§五 | 2.22/2.24 | 同步组件树、文件结构、阶段 2 任务 |
| `doc/scene-design.md` §三 | 2.23 | 元素位置表改为"图 + 3D 浮层"模式 + 标定参数 |
| `checklist/stages/stage-2-数据层+场景一.md` | 全部 | 同步 2.14-2.25 详细描述 |
| `checklist/progress.md` | 全部 | 同步 2.14-2.25 状态行 |

### 6.3 删除文件

| 文件 | 任务 | 理由 |
|------|:---:|------|
| `src/components/SkyDome.jsx` | 2.22 | 场景一不再用 day 变体；保留 night 变体（场景二用）→ 拆为 `SkyDome.jsx`（night only）|
| `src/components/Ground.jsx` | 2.22 | 图片替代 |
| `src/components/BackgroundLayers.jsx` | 2.22 | 图片替代 |
| `src/components/GrassTufts.jsx` | 2.22 | 图片替代 |
| `src/components/ForegroundFlowers.jsx` | 2.22 | 图片替代 |
| `src/components/ScorchMark.jsx` | 2.22 | 与新图中央营火可能冲突；如决定保留需重新标定 |
| `public/textures/` (部分) | 2.22 | 图片替代手绘纹理；`star.png`（场景二）保留 |

### 6.4 复用现有 utility

- `src/utils/bookmarks.js` —— 已有，不动
- `src/hooks/useBookmarks.js` —— 已有，不动
- `src/components/Signpost.jsx` 的 `layoutTwoColumns()` —— 2.22 阶段保留算法
- `src/components/Path.jsx` 的 `buildPathShape()` —— 2.22 阶段保留算法（参数化）

---

## 七、Verification（端到端验证）

### 7.1 自动化验证

| 检查 | 命令 | 通过条件 |
|------|------|---------|
| 单元 + 集成测试 | `npm test` | 28+ tests 全过（含 35 个 GWT 场景，spec.md §八）|
| 构建 | `npm run build` | < 300ms，bundle 体积不增（drei 已用清单 0 增量）|
| Lint | `npm run lint`（如有）| 无错 |
| E2E | `npx playwright test` | 2 E2E 全过 |
| 首帧性能 | Chrome 实测 | < 500ms（含图片 200ms 淡入）|

### 7.2 视觉验证（任务 2.25 逐项审查）

对照参考图（用户最新提供的图）：

- [ ] 背景图 = 用户提供的黄昏湖畔图（地平线 1/3、暖色调、湖边、远山、营火、小径）
- [ ] 路牌柱 3D 浮在图上，**位置**：画面中央略偏（依标定值）
- [ ] 篝火 3D 浮在图中篝火痕迹位置，发光晕染
- [ ] 小路 3D 引导线沿图中泥土小径延伸
- [ ] 萤火虫 14 颗飘在画面上 1/2
- [ ] 远景飞鸟 4 只从左侧飞向右侧
- [ ] 栖于柱顶小鸟拍翅膀
- [ ] 8 项 art-style.md §8 清单通过：
  - [ ] 低饱和温润色 ✅
  - [ ] 平涂色块、toon 2-3 阶色阶 ✅
  - [ ] 粗圆描边 ✅
  - [ ] 前景简洁 + 背景精 ✅
  - [ ] 水彩材质（图片自带）✅
  - [ ] 治愈留白 ✅
  - [ ] 萌感圆润 ✅
  - [ ] 手工感文字（drei Text 手写体）✅
- [ ] 阻尼过渡 1.5-2.0s（点击指示牌 → 星空）
- [ ] popup 选图 → 切换正常 + 持久化
- [ ] 图片加载失败 → 降级纯色 + 控制台 warn（SP1.1.1）
- [ ] 空状态：3 块占位指示牌正常显示（SP2.1）
- [ ] 4 项 art-style.md §8 性能 + 可访问性通过（SP5.x / SP6.x / SP7.1）

### 7.3 性能验证

- 构建：< 300ms
- 首帧：< 500ms（含图片 200ms 淡入）
- 动画：60fps（hover / 萤火虫 / 鸟翅）
- 大量书签：≤200 书签进星空不卡（场景一不受影响，但 28 tests 覆盖）

---

## 八、不做的（边界）

延续 ADR-004 "不做的" 清单 + 本计划明确：

- ❌ **不**升级场景二（星空保持 3D 现状）
- ❌ **不**做每日换背景图（任务 2.24 精简为 popup 手动选）
- ❌ **不**引入 postprocessing / glsl-noise / TS（ADR-002 暂缓）
- ❌ **不**外包建模 / 不引入 GLTF（0 外部资源原则）
- ❌ **不**做 Octopath HD-2D 管线（远超 MVP）
- ❌ **不**用 drei `<Sparkles>` 替代 Fireflies（保留自定义手作感更贴合 art-style.md §6.2）
- ❌ **不**做更精确的 3D 坐标（颗粒度按用户决策到任务分解层；坐标是 2.23 标定阶段产物）
- ❌ **不**重生成 AI 图片（用户决策：直接用参考图）
- ❌ **不**保留 5 个 3D 环境组件（SkyDome day / Ground / BackgroundLayers / GrassTufts / ForegroundFlowers）—— 图片替代

---

## 九、风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|:---:|:---:|------|
| 图片版权 / 来源问题 | 极低 | 高 | 用户已确认使用（AskUserQuestion）|
| 3D 元素与图"对不上" | 中 | 中 | 任务 2.23 标定工具 + 视觉回归（2.25）|
| 图片加载慢（影响首帧 < 500ms）| 中 | 中 | 预加载 + 200ms 淡入（BackgroundImage 组件内置）|
| 3D 元素被图"压住"（z 冲突）| 中 | 中 | z-depth 严格管理（背景 z=-10，浮层 -1~1.5）|
| 删除的组件被其他场景引用 | 低 | 高 | 任务 2.22 阶段 grep 验证 |
| drei `<Text>` 字体加载慢 | 低 | 中 | 选 CDN 字体 + CanvasTexture 兜底 |
| 阻尼过渡掉帧 | 低 | 低 | maath damp3 已是低开销方案 |

---

## 十、参考

- `doc/decisions/ADR-003-prioritize-scene1-to-reference.md`（被取代）
- `doc/decisions/ADR-004-scene1-photo-plus-3d-overlay.md`（现行）
- `spec.md` v0.2.0 §一 SP1.x（场景一规格）
- `doc/scene/scene1-background-image-requirements.md` v1.0（图片要求）
- `doc/scene-prompt/scene-1-background-image01.md`（图片 prompt，本期不用）
- `doc/art-style.md` §四 §八（画风基准 + 验收清单）
- `doc/scene-design.md`（待更新 §三 元素位置表）
- `checklist/stages/stage-2-数据层+场景一.md`（待同步 2.14-2.25）
- `checklist/progress.md`（待同步 2.14-2.25 状态行）

---

## 十一、版本

- v1.0（2026-06-08）：初版。基于 ADR-003 → ADR-004 链 + spec.md v0.2.0 + 用户最新参考图决策 + AskUserQuestion 3 项确认。
