# 阶段 1 — 项目骨架

**状态：** ✅ 全部完成
**日期：** 2026-06-03
**任务数：** 7
**已完成：** 7

## 目标
搭建 Chrome MV3 new-tab 扩展的最小可运行骨架：构建工具 + 入口 + 扩展清单 + 测试基础设施。
让开发阶段的所有任务都有"基础设施可用"。

## 任务清单

### 任务 1.1 — Vite + React + R3F 项目初始化
**状态：** ✅ 已完成 | **日期：** 2026-06-03
初始化 Vite + React + React Three Fiber 项目骨架。`package.json`、vite.config.js、src/main.jsx、src/App.jsx。`npm run dev` 启动成功，浏览器显示空白 Canvas 无报错。

### 任务 1.2 — @crxjs/vite-plugin 扩展打包配置
**状态：** ✅ 已完成 | **日期：** 2026-06-03
集成 @crxjs/vite-plugin 以支持 Chrome 扩展打包。`npm run build` 输出 dist/ 目录（含 manifest.json + newtab.html）。

### 任务 1.3 — manifest.json 创建
**状态：** ✅ 已完成 | **日期：** 2026-06-03
Chrome MV3 manifest：name / version / chrome_url_overrides (newtab) / permissions (bookmarks, search) / icons。

### 任务 1.4 — newtab.html 入口创建
**状态：** ✅ 已完成 | **日期：** 2026-06-03
Chrome 扩展 newtab override 的 HTML 入口，关联 src/main.jsx。

### 任务 1.5 — Vitest 测试基础设施搭建
**状态：** ✅ 已完成 | **日期：** 2026-06-03
vitest.config.js + src/test/setup.js + @testing-library/react。`npm test` 运行成功。

### 任务 1.6 — Playwright E2E 测试环境搭建
**状态：** ✅ 已完成 | **日期：** 2026-06-03
playwright.config.js + e2e/ 目录 + @playwright/test。`npx playwright test` 运行成功。

### 任务 1.7 — Chrome 中加载未打包扩展验证
**状态：** ✅ 已完成 | **日期：** 2026-06-03
用户在 Chrome 中加载 dist/ 为未打包扩展，验证基础流程（chrome://extensions → 开发者模式 → 加载 dist/）。

## 阶段产出
- 可构建的 Chrome MV3 扩展项目
- 单元测试 + E2E 测试双轨
- 7 个开发依赖已就位

## 验证
- ✅ `npm run dev` 启动
- ✅ `npm run build` 输出 dist/
- ✅ `npm test` 运行
- ✅ `npx playwright test` 运行
- ✅ Chrome 加载 dist/ 正常

## 备注
- 阶段 2 启动需：阶段 0 的任务 0.6 / 0.7 用户确认
- 当前 `dev` 工作流：扩展加载 dist/（生产 build 模式），不是 dev server
