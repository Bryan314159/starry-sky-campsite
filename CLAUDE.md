# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Starry Sky Campsite** (收藏夹可视化) — a Chrome new-tab extension that transforms browser bookmarks into an immersive visual journey. The user opens a new tab and enters a hand-drawn campsite scene where bookmark folders appear as wooden signposts. Clicking a signpost transitions to a starry night sky where each star represents a bookmark (click to open, hover to preview).

See [项目梗概](doc/项目梗概.md) for the concept and [demand.md](doc/demand.md) for detailed requirements and technical decisions.

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

## Progress Tracking

- **所有任务必须在 `checklist/progress.md` 中实时更新状态。**
- 完成任务后，先更新 `checklist/progress.md` 中对应任务的标志为 ✅，再提交 git。
- 新增任务时，在对应的开发阶段下追加条目。
- `checklist/progress.md` 是项目进度的唯一真相源。
