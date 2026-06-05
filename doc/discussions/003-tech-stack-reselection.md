# 讨论 003：技术栈重新选择

**日期：** 2026-06-05
**触发**：`doc/inspiration-research.md` 完成 → 调研了 3 个维度的同类项目（new-tab 扩展 / 书签可视化 / Three.js 手绘技法），识别出可借鉴的范式与技法。
**目的**：从 `inspiration-research.md` 中筛出**可应用到本项目**的项，对当前技术栈做一次重选决策。
**范围**：技术栈（库 / 框架），不涉及产品功能 / 文案 / 视觉风格本身。

---

## 背景

项目当前处于 MVP 后段（81.8% 完成），即将进入交付。`inspiration-research.md` 调研后浮现 8 条按 ROI 排序的技法候选 + 12 个参考项目。本讨论聚焦"**技术栈重选**"——即是否要为这些技法新增 / 替换 / 移除某些库。

### 现状核对（事实层）

| 库 | design.md | package.json | 实际代码 |
|------|:---:|:---:|:---:|
| React 19.2 | ✅ | ✅ | ✅ 使用 |
| three 0.184 + @react-three/fiber 9.6 | ✅ | ✅ | ✅ 使用 |
| **@react-three/drei 10.7** | ✅ | ✅ | ⚠️ **已装未用** |
| **@react-three/postprocessing** | ✅ 提及 | ❌ 未装 | ❌ 未用 |
| Vite 8.0 + @crxjs/vite-plugin 2.4 | ✅ | ✅ | ✅ 使用 |
| Vitest 4 + Playwright + Testing Library | ✅ | ✅ | ✅ 使用 |
| React Context + useReducer | ✅ | (内置) | ✅ 使用 |
| JavaScript (JSX) | ✅ | (内置) | ✅ 使用 |

> **关键发现**：drei 是"挂名"的，postprocessing 是"画饼"的。这两个差距正是本研究要决策的核心。

---

## 决策总览

经过渲染层 / 骨架 / 状态层三个维度并行讨论，得出三类决策：

| 类别 | 数量 | 处理 |
|------|:---:|------|
| 🟢 保留 | 4 项 | 当前已用且适合 MVP |
| 🟢 新增使用 | 3 项 | drei 已装，释放价值 |
| 🟡 选 1-2 用 | 1 项 | drei 内子功能，按需挑选 |
| 🟡 暂缓 | 4 项 | 列入第二批实施 |
| 🔴 不引入 | 6 项 | 一句话理由带过 |

---

## 一、🟢 保留项

| 库 | 角色 | 保留理由 |
|------|------|---------|
| **Vite 8.0 + @crxjs/vite-plugin 2.4** | 构建 + 扩展打包 | 跑得通，HMR 体验好；Vite 8 是最新版，build ~280ms 满足 4.5 首帧 < 500ms 硬约束 |
| **React 19 + Context + useReducer** | 框架 + 状态 | 项目小，状态 4 个字段（scene / selectedFolder / bookmarks / hoverInfo），不需升级 |
| **three 0.184 + @react-three/fiber 9.6** | 3D 核心 | R3F 是 React + Three.js 的最佳封装，生态成熟 |
| **Vitest 4 + Playwright + Testing Library** | 测试 | 28 tests + 2 E2E 全过；Playwright 支持扩展环境 |

---

## 二、🟢 新增使用项（drei 已装未用 → 释放价值）

### 2.1 `<Outlines screenspace>` 包裹前景对象

| 维度 | 内容 |
|------|------|
| **来源** | `inspiration-research.md` §四.2 |
| **ROI** | 🟢 低难度 / ⭐⭐⭐⭐⭐ 收益 |
| **优先级** | 🥇 第一批立即 |
| **作用对象** | Signpost、SignBoard、Campfire、ForegroundFlowers、SignpostBird、Tree 剪影 |
| **理由** | drei 描边粗细屏幕空间恒定，动画感的关键。当前 SignBoard 用 canvas 画的 wobble 边框"看着像"，但远景树丛和小鸟没法画边框。`<Outlines>` 是统一方案。 |
| **与 art-style.md 对齐** | §8 画风执行清单要求"无影" + 干净线条，Outlines 是"插画感"最直接的实现 |

### 2.2 `MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter`

| 维度 | 内容 |
|------|------|
| **来源** | `inspiration-research.md` §四.1 + §五.2 |
| **ROI** | 🟢 低难度 / ⭐⭐⭐⭐⭐ 收益 |
| **优先级** | 🥇 第一批立即 |
| **作用对象** | 所有 toon 材质（Signpost、Campfire、ForegroundFlowers、Path、Ground） |
| **理由** | 当前用 `meshToonMaterial` 但**没显式提供 gradientMap**，等于 255 阶渐变 = 退化成普通 Lambert。3 阶 gradientMap + `NearestFilter` 是"插画"和"渲染"的分水岭。 |
| **与 art-style.md 对齐** | §8 要求"无影"（无平滑过渡阴影），量化色阶是核心实现 |

### 2.3 `PerspectiveCamera` + makeDefault + 阻尼过渡

| 维度 | 内容 |
|------|------|
| **来源** | `inspiration-research.md` §三.10 Lost at Night |
| **ROI** | 🟢 低难度 / ⭐⭐⭐ 收益 |
| **优先级** | 🥈 一周内 |
| **作用对象** | 当前 CameraController 硬切（`camera.position.copy(...)`） |
| **理由** | Lost at Night 的"深蓝紫 + 慢阻尼相机"是星空氛围配方的一部分。当前营地 → 星空是"啪"地跳过去，与"治愈系"违背。drei `PerspectiveCamera` makeDefault + maath/damp3 做位置/朝向的 lerp，过渡 ~600ms。 |
| **与 art-style.md 对齐** | §1 "动效缓慢、克制"是核心调性 |

---

## 三、🟡 选 1-2 用项（drei 内部子功能）

| 候选 | 用途 | 建议 |
|------|------|------|
| **`<Text>`** | 替代 DOM Overlay 文字（SignBoard 文字、Tooltip） | **🟢 推荐用**：让 SignBoard 文字随指示牌在 3D 空间旋转时也能保持正确透视 |
| **`<Sparkles>`** | 替代自制萤火虫（Fireflies）组件 | **🟢 推荐用**：drei 内置 ~50 行实现，比当前 14 粒手工实现更稳 |
| **`<Float>`** | 让 Signpost 微微浮动 | **🔴 不用**：会与"静止稳重"的营地氛围冲突 |
| **`<Environment>`** | HDR 环境光照 | **🔴 不用**：违反 toon 风格的"无影"原则 |

---

## 四、🟡 暂缓项（第二批实施）

| 候选 | 暂缓理由 | 何时重新评估 |
|------|---------|-------------|
| **`@react-three/postprocessing`** | 加 70KB；MVP 不需要 | 实施 Bayer 颜色量化（`inspiration-research.md` §四.4）或 Bloom 时 |
| **`glsl-noise` / `three-custom-shader-material`** | 当前 ShaderMaterial 用 simple noise 已够 | 实施 SkyDome 域扭曲 fBm（`inspiration-research.md` §四.6）时 |
| **TypeScript 迁移** | 当前 28 测试通过，TS 改造 ROI 低 | 代码量翻倍或多人协作时 |
| **Zod / Valibot 校验 chrome.bookmarks 数据** | MVP 边界 case 简单，未来再考虑 | 出现真实 chrome.bookmarks 畸形数据 case 时 |

---

## 五、🔴 不引入项（一句话理由）

| 候选 | 不引入理由 |
|------|---------|
| **Plasmo** | Plasmo 适合复杂多页面扩展；我们单 new-tab，过度工程化 |
| **WXT** | WXT 更现代但学习曲线；等 @crxjs 出现维护困难再迁移 |
| **cannon-es / rapier 物理库** | MVP 不漫游；引入 +200KB 违反 4.5 首帧 < 500ms |
| **Tailwind / UnoCSS** | 当前 SearchBar / Tooltip 单文件 CSS 足够；引入增加心智 |
| **zustand / jotai** | Context 已够；多 1KB 但要学新 API，零收益 |
| **react-query / SWR** | 书签很少变，缓存无价值 |
| **Pixi.js / Konva 2D 层** | Octopath HD-2D 是长期目标；MVP 完全不需要 |
| **Inverted-hull 自定义 ShaderMaterial** | 有 drei `<Outlines>` 就够 |

---

## 六、关联

- `doc/inspiration-research.md` §四.1 / §四.2 / §四.6 / §五.2 — 本讨论的核心数据来源
- `doc/design.md` §2.2 — 当前技术栈的权威声明（**待同步**：把 `drei` 从"声明"升级为"已使用"）
- `doc/art-style.md` §8 — 画风执行清单（Outlines + gradientMap 是 §8 的具体实现）
- `checklist/stages/stage-2-数据层+场景一.md` — 任务 2.11 / 2.12 已部分用 canvas 纹理模拟 Outlines，未来可替换

---

## 七、未来动作

| # | 任务 | 编号（建议） | 备注 |
|---|------|-------------|------|
| 1 | drei `<Outlines>` 包裹 Signpost/SignBoard/Campfire/ForegroundFlowers/SignpostBird | **2.14** | 第一批 |
| 2 | 全场景 MeshToonMaterial + 3 阶 gradientMap + NearestFilter | **2.15** | 第一批 |
| 3 | 场景切换相机阻尼过渡（drei `PerspectiveCamera` + maath damp3） | **2.16** | 第一批 |
| 4 | drei `<Text>` 替代 SignBoard DOM 文字 | **2.17** | 第一批（评估后） |
| 5 | drei `<Sparkles>` 替代自制的 Fireflies | **2.18** | 第一批（评估后） |
| 6 | 同步 `doc/design.md` §2.2：drei 从"已声明"升级为"已使用" | doc-only | 与本讨论同 commit |
| 7 | 同步 `checklist/progress.md`：新增任务 2.14–2.18 + 关联灵感研究的"已落地"清单 | doc-only | 与本讨论同 commit |

> 本讨论的产出（2.14–2.18 五个实施任务）将在 `inspiration-research.md` v1.1 中标注"已落地"。

---

## 八、版本

- v1.0（2026-06-05）：初版。基于 `inspiration-research.md` v1.0 综合整理；与用户确认后落盘。
