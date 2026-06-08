# 阶段 6 — 工具链与检索（codegraph）

**状态：** ✅ 全部完成（1/1）
**日期：** 2026-06-08 —
**任务数：** 1
**已完成：** 1

## 目标

把 codegraph MCP 落地为**项目默认的代码检索 / 架构问答入口**，把"X 怎么工作 / 在哪 / 架构 / 流程"类问题从"委派 Explore 子 Agent"收敛到"直接调 codegraph tool"。索引延迟约 1s，毫秒级响应，Read 等价结果。

## 任务清单

### 任务 6.1 — codegraph 初始化 + 检索约定落地
**状态：** ✅ 已完成 | **日期：** 2026-06-08

在项目根目录初始化 codegraph 索引 + 在 CLAUDE.md 写入"Code Intelligence (codegraph)"章节固化工具选型矩阵与回退规则。

- ✅ `codegraph init` 完成，35 文件 / 231 节点 / 383 边
- ✅ `codegraph_status` / `codegraph_files` / `codegraph_explore` / `codegraph_search` / `codegraph_callers` 全部跑通
- ✅ CLAUDE.md 新增 §Code Intelligence（codegraph）
  - 工具选型矩阵（哪类问题用哪个 tool）
  - 明确：**不再**把架构/检索问题委派给 Explore 子 Agent
  - 回退规则：仅当 codegraph 未覆盖单个具体细节时，才用 Read/Grep
- ✅ `checklist/progress.md` 新增 §阶段 6，统计刷新至 45/37/82.2%

**索引健康指标：**
- 文件：35
- 节点：231（function 70 / file 35 / constant 22 / import 104）
- 边：383
- 库大小：0.57 MB
- 后端：node:sqlite + WAL + FTS5
- 语言分布：javascript 10 / jsx 25

## 阶段产出

- `.codegraph/` 索引（自动通过 file watcher 同步，约 1s 延迟）
- `CLAUDE.md` §Code Intelligence 章节（持久化约定）
- `checklist/stages/stage-6-工具链+codegraph.md`（本文档）
- `checklist/progress.md` 阶段 6 + 统计刷新

## 验证

- ✅ `codegraph_explore` 一次调用即返回 `App` / `AppInner` / `SceneRouter` / `AppProvider` 等核心符号的源文件内容 + 调用路径 + blast radius
- ✅ `codegraph_search` "useBookmarks" 返回 3 个匹配（含 1 个 `load` 函数）
- ✅ `codegraph_callers` "AppProvider" 返回 2 个调用方（App + setup test）
- ✅ `codegraph_files` 输出完整 35 文件目录树

## 备注

- `codegraph init` 当前被 auto mode 拦截为"写文件操作"——本项目约定：用户终端用 `! codegraph init` 手动执行（CLAUDE.md §Code Intelligence 已记）
- 后续 `codegraph sync` 增量重建可由 AI 直接调，无须手动（仅写 `.codegraph/`，仍是 init-only 操作）
- 任何"未来要做但还没做"的工具/约定都可以挂到本阶段（例如未来若加 `eslint` / `prettier` 之类的工具链调整）；但本阶段当前只关心 codegraph 一项
- **不**在本阶段追踪与产品功能 / 视觉 / 性能相关的任务（这些仍走 1-5 阶段）
