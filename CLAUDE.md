# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Starry Sky Campsite** (收藏夹可视化) — a Chrome new-tab extension that transforms browser bookmarks into an immersive visual journey. The user opens a new tab and enters a hand-drawn campsite scene where bookmark folders appear as wooden signposts. Clicking a signpost transitions to a starry night sky where each star represents a bookmark (click to open, hover to preview).

See [项目梗概](doc/项目梗概.md) for the concept, [demand.md](doc/demand.md) for detailed requirements, and [scene-design.md](doc/scene-design.md) for visual composition specs.

## Tech Stack

- **Platform:** Chrome Extension Manifest V3 (new-tab override)
- **3D Rendering:** Three.js via React Three Fiber (R3F)
- **UI Framework:** React
- **Build Tool:** Vite
- **Visual Style:** Hand-drawn / illustration style with toon materials, warm campsite vs. serene starry night. **Art style reference: 《罗小黑战记》(The Legend of Luo Xiaohei)** — flat-shaded "无影" technique, clean rounded lines, low-saturation治愈系 color palette. See [画风参考文档](doc/art-style.md).
- **Data Source:** `chrome.bookmarks` API — flat read of top-level folders and their immediate children only

## Architecture

Two scenes managed by React state — no routing library needed:

- **Scene 1 (Campsite · Signposts):** Default view. Renders a grassy ground plane, a wooden signpost with directional boards (each labeled with a bookmark folder name), and a path receding into depth. Clicking a board transitions to Scene 2.
- **Scene 2 (Starry Sky · Bookmarks):** Night sky with procedurally scattered stars (random sizes). Each star maps to a bookmark from the selected folder. Click a star → `window.location.href = url` (opens in current tab). Hover → name tooltip + subtle glow/scale effect. Click the path on the ground → return to Scene 1.

**Data flow:** Chrome Bookmarks API → React context/store → R3F scene components. Isolate bookmark data fetching from rendering — the API returns a tree, but only top-level folders and their direct children are used (no deep nesting).

**Empty state:** When the user has no bookmarks, signposts display pre-designed placeholder text.

## Code Intelligence (codegraph)

本项目使用 **codegraph MCP** 作为代码检索与架构问答的首选入口（`.codegraph/` 索引已构建：35 文件 / 231 节点 / 383 边，毫秒级响应）。**不再**把"X 怎么工作 / 在哪 / 调用谁 / 架构 / 流程"类问题委派给会读文件的 Explore 子 Agent —— 那会重复 codegraph 已做过的索引扫描、消耗更多 token 且结果质量更差。

### 工具选型矩阵

| 意图 | 用什么 tool | 说明 |
|------|------------|------|
| "X 怎么工作" / 架构 / 调查一个区域 / bug 调查 | `codegraph_explore` | **首选 / 第一调用**。自然语言问题或一袋符号名，一个 capped 调用就返回分组好的原代码。多数情况下是**唯一**需要的 codegraph 调用 |
| "X 怎么到 Y" / 调用流程 / 跨多符号的路径 | `codegraph_explore` | 命名流程上跨越的符号即可，会回溯动态分发链路（React 重渲染、JSX children、callback） |
| "名字叫 X 的符号在哪" / 位置 | `codegraph_search` | 仅返回位置，不带代码 |
| "谁调用 X" | `codegraph_callers` | |
| "X 调用了谁" | `codegraph_callees` | |
| "改 X 会影响什么" | `codegraph_impact` | 重构前必跑 |
| 项目结构概览 | `codegraph_files` | 比 Glob 快 |
| 索引健康检查 | `codegraph_status` | 仅调试时用 |

### 回退规则

- codegraph 没说清的**单个具体细节**（如某个常量值、某行代码上下文）→ 退回 `Read`
- 大段正则 / 多文件 grep 模式匹配 → 退回 `Grep`
- **不要**自己跑 Read + Grep 循环做"架构调研"——那就是 Explore Agent 干的活，codegraph 已经替我们做完了

### 索引维护

- 项目根目录有 `.codegraph/`，文件改动通过 watcher 自动同步（约 1s 延迟）
- 手动重建：`codegraph sync`（增量）/ `codegraph init`（全量，会覆盖）
- `codegraph init` 当前由 auto mode 拦截，需用户在终端用 `! codegraph init` 手动执行

## MVP Scope

Per [demand.md](doc/demand.md#七功能范围):

- Both scenes with full interaction (click signpost → stars, click star → open URL, click path → back)
- Search bar integrated into the scene
- Empty state (placeholder text on signposts)
- Random star sizing
- **NOT in MVP:** Cat walking animation between scenes, analytics backend for click frequency, Firefox support

## Key Design Constraints

- Must load fast as a new-tab replacement — keep bundle lean, avoid heavy dependencies
- Hand-drawn aesthetic means textures and toon shaders, not photorealistic PBR
- All 3D assets (signpost, path, ground, stars, cat) should be procedurally generated or loaded as lightweight GLTF/texture assets
- The cat character (design pending) will be the scene-transition protagonist

## Git Workflow

- **每个任务完成后必须提交 git commit**，不允许积累多个任务后批量提交。
- **每次 git commit 前必须经过用户确认**，用户在确认前不得执行提交。确认方式：向用户展示待提交的文件清单和 commit message，等待用户明确同意后再执行 `git commit`。

## Plan File Management

所有 plan mode 产出的 plan 文档，**先存入 `doc/plan/new/`**；当 plan 中包含的任务**全部完成**后，**移入 `doc/plan/done/`**。

### 目录约定

```
doc/plan/
├── new/               ← 活跃 plan（任务进行中）
│   └── <plan-name>.md
└── done/              ← 已完成 plan（任务全部 ✅）
    └── <plan-name>.md
```

### 命名约定

- 文件名：`kebab-case-<topic>.md`
- 例：`adr-004-scene1-photo-plus-3d-overlay.md`（避免 `-partitioned-deer` 这类自动随机后缀）
- 命名应能体现 plan 覆盖的 topic（如 `scene1` / `popup-选图` / `storage-persistence`）

### 生命周期

```
plan mode 产出 plan 草案
        ↓ 用户确认（ExitPlanMode 批准）
进入 doc/plan/new/，状态字段 = "活跃"
        ↓
每完成一个子任务 → 在 plan 内的"实际改动"小节追加条目
        ↓
所有子任务完成（checklist 全 ✅）
        ↓
移入 doc/plan/done/，状态字段 = "已完成"
```

### 与 Session-level plan 的关系

- `~/.claude/plans/` 是**会话临时文件**，跨 session 易丢失
- `doc/plan/` 是**项目内归档**，进入 git 跟踪，作为项目知识的一部分
- 凡是 plan mode 产出的 plan，**必须**同步归档到 `doc/plan/new/`（不仅仅是放进 `~/.claude/plans/`）

### 与 `checklist/progress.md` 的关系

- `checklist/progress.md` 跟踪**任务状态**（✅ / 🔄 / ⬜）
- `doc/plan/new/` 跟踪**设计决策与计划**（为什么这么做 / 怎么做 / 不做什么）
- 两者互补：plan 决定"做什么"，checklist 决定"做完没"

## Progress Tracking

- **`checklist/progress.md` 是项目进度的索引 + 状态表**（每个阶段一张表，含任务状态 / 备注 / 阶段文档链接）。
- **每个阶段有独立详细文档**：`checklist/stages/stage-N-<name>.md`
  - 文档结构：阶段概述 → 任务清单（每个任务的目标 / 改动 / 验证 / 备注）→ 阶段产出 → 验证 → 备注
  - 重大任务（如 2.11 / 2.12 / 2.13）在阶段文档内展开详细描述
- 完成任务后：
  1. 更新 `checklist/progress.md` 表格中对应行的标志为 ✅
  2. 同步更新 `checklist/stages/stage-N-<name>.md` 内任务详情（实际改动 / 验证 / 关联）
  3. 提交 git
- 新增任务时：在 `checklist/progress.md` 表格追加行 + 在 `checklist/stages/stage-N-<name>.md` 补充
- 状态说明：✅ 已完成 / 🔄 进行中 / ⬜ 待开始 / ⏸️ 暂停 / ❌ 已取消
- `checklist/progress.md` + `checklist/stages/` 共同构成项目进度的"唯一真相源"。
