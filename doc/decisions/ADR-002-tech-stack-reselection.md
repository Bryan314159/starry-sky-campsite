# ADR-002：技术栈重选 — 释放 drei 价值 + 暂缓非必要依赖

**日期：** 2026-06-05
**状态：** 已采纳（待实施）
**关联：** `doc/discussions/003-tech-stack-reselection.md`（来源讨论）· `doc/inspiration-research.md`（数据来源）· `doc/design.md §2.2`（待同步）

---

## 背景

完成 `inspiration-research.md` 三维调研（new-tab 扩展 / 书签可视化 / Three.js 手绘技法）后，对当前技术栈做事实核对发现两个显著差距：

| 库 | design.md 声明 | package.json | 实际代码 |
|------|:---:|:---:|:---:|
| `@react-three/drei 10.7` | ✅ | ✅ | ⚠️ **已装未用**（"挂名"） |
| `@react-three/postprocessing` | ✅ 提及 | ❌ 未装 | ❌ 未用（"画饼"） |

> **关键发现**：drei 是免费的增量价值来源（已经装、不增加 bundle 风险），postprocessing 是真要权衡的（要 70KB）。

讨论得出三维度（渲染层 / 骨架 / 状态层）的 18 个候选点，需要给出"保留 / 新增 / 暂缓 / 不引入"决策。

---

## 决策

### 🟢 保留 4 项

| 库 | 角色 | 保留理由 |
|------|------|---------|
| **Vite 8.0 + @crxjs/vite-plugin 2.4** | 构建 + 扩展打包 | 跑得通，HMR 体验好；Vite 8 是最新版，build ~280ms 满足 4.5 首帧 < 500ms 硬约束 |
| **React 19 + Context + useReducer** | 框架 + 状态 | 项目小，状态 4 个字段（scene / selectedFolder / bookmarks / hoverInfo），不需升级 |
| **three 0.184 + @react-three/fiber 9.6** | 3D 核心 | R3F 是 React + Three.js 的最佳封装，生态成熟 |
| **Vitest 4 + Playwright + Testing Library** | 测试 | 28 tests + 2 E2E 全过；Playwright 支持扩展环境 |

### 🟢 新增使用 3 项（drei 已装未用 → 释放价值）

| 决策 | 来源 | ROI | 优先级 |
|------|------|:---:|:---:|
| **`<Outlines screenspace>`** 包裹 Signpost / SignBoard / Campfire / ForegroundFlowers / SignpostBird / 远景树 | §四.2 | 🟢⭐⭐⭐⭐⭐ | 🥇 第一批 |
| **`MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter`**（全场景） | §四.1 + §五.2 | 🟢⭐⭐⭐⭐⭐ | 🥇 第一批 |
| **`PerspectiveCamera` + makeDefault + 阻尼过渡**（场景切换慢切） | §三.10 Lost at Night | 🟢⭐⭐⭐ | 🥈 一周内 |

### 🟡 选 1-2 用 1 项

| 候选 | 用途 | 决策 |
|------|------|------|
| drei `<Text>` | 替代 DOM Overlay 文字 | 🟢 **用**（让 SignBoard 文字随 3D 空间旋转保持正确透视） |
| drei `<Sparkles>` | 替代自制 Fireflies | 🟢 **用**（drei 内置 ~50 行实现比当前 14 粒手工实现更稳） |
| drei `<Float>` | Signpost 微微浮动 | 🔴 **不用**（与"静止稳重"氛围冲突） |
| drei `<Environment>` | HDR 环境光照 | 🔴 **不用**（违反 toon 风格的"无影"原则） |

### 🟡 暂缓 4 项（第二批实施）

| 候选 | 暂缓理由 | 何时重新评估 |
|------|---------|-------------|
| `@react-three/postprocessing` | 加 70KB；MVP 不需要 | 实施 Bayer 颜色量化（§四.4）或 Bloom 时 |
| `glsl-noise` / `three-custom-shader-material` | 当前 ShaderMaterial 用 simple noise 已够 | 实施 SkyDome 域扭曲 fBm（§四.6）时 |
| TypeScript 迁移 | 当前 28 测试通过，TS 改造 ROI 低 | 代码量翻倍或多人协作时 |
| Zod / Valibot 校验 chrome.bookmarks 数据 | MVP 边界 case 简单 | 出现真实 chrome.bookmarks 畸形数据 case 时 |

### 🔴 不引入 8 项

| 候选 | 不引入理由 |
|------|---------|
| **Plasmo** | Plasmo 适合复杂多页面扩展；本项目单 new-tab，过度工程化 |
| **WXT** | WXT 更现代但学习曲线；等 @crxjs 出现维护困难再迁移 |
| **cannon-es / rapier 物理库** | MVP 不漫游；引入 +200KB 违反 4.5 首帧 < 500ms |
| **Tailwind / UnoCSS** | 当前 SearchBar / Tooltip 单文件 CSS 足够；引入增加心智 |
| **zustand / jotai** | Context 已够；多 1KB 但要学新 API，零收益 |
| **react-query / SWR** | 书签很少变，缓存无价值 |
| **Pixi.js / Konva 2D 层** | Octopath HD-2D 是长期目标；MVP 完全不需要 |
| **Inverted-hull 自定义 ShaderMaterial** | 有 drei `<Outlines>` 就够 |

---

## 原因

1. **"已装未用"比"未装"成本低很多** —— drei 已在 bundle 里（已被 @react-three/fiber 等传递依赖），`<Outlines>` 实际增量 ~5KB
2. **art-style.md §8 的"无影"和"清晰描边"没有落地实现** —— 当前 SignBoard 用 canvas 画的 wobble 边框"看着像"，但远景树丛、篝火、小鸟、远山**没有**任何描边。`<Outlines>` 是统一方案
3. **MeshToonMaterial 没配 gradientMap = 退化为 Lambert** —— `<meshToonMaterial color="..." />` 缺了 `gradientMap` 就是 255 阶平滑渐变，等于没用 toon
4. **首帧 < 500ms 是硬约束**（任务 4.5）—— 任何新依赖都要算 bundle 增量，drei 子功能是 0 增量
5. **Plasmo / WXT 过度工程** —— 解决"@crxjs 不够"的问题，但 @crxjs 现在**没出问题**

---

## 后果

### 立即后果
- 4 个新任务（2.14–2.18）加入 `checklist/progress.md` 与 `stage-2-数据层+场景一.md`
- `doc/design.md §2.2` "drei 已装未用" 备注需更新为"已使用：Outlines / MeshToonMaterial / PerspectiveCamera / Text / Sparkles"
- 预计工期：**1 周**（任务 2.14 Outlines + 2.15 gradientMap + 2.16 阻尼相机 + 2.17 Text + 2.18 Sparkles）

### 后续
- postprocessing / TS / Zod 进入"第二批"清单，等具体需求出现再评估
- `inspiration-research.md` "已落地"清单要同步更新（v1.1）

---

## 验证

- ✅ 渲染层：drei 子功能 5 项（Outlines / gradientMap / damped camera / Text / Sparkles）实施后，可对照 art-style.md §8 清单逐条审查
- ✅ 性能：bundle 增量 ≈ 5KB（drei 子功能），不违反 4.5 < 500ms
- ✅ 测试：28 tests + 2 E2E 仍全过；新增材质 + 描边需要新增视觉回归测试

---

## 参考

- `doc/discussions/003-tech-stack-reselection.md` —— 本 ADR 的完整讨论记录
- `doc/inspiration-research.md` §四.1 / §四.2 / §四.6 / §五.2 —— 决策的数据来源
- `doc/design.md §2.2` —— 当前技术栈声明（待同步）
- `doc/art-style.md §8` —— 画风执行清单（Outlines + gradientMap 是 §8 的具体实现）
- `checklist/stages/stage-2-数据层+场景一.md` —— 任务 2.11 / 2.12 已用 canvas 模拟，未来可替换

---

## 版本

- v1.0（2026-06-05）：初版。基于 `discussions/003` 综合。
