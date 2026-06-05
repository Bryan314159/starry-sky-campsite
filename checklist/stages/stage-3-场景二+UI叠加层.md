# 阶段 3 — 场景二 + UI 叠加层

**状态：** ✅ 全部完成
**日期：** 2026-06-03
**任务数：** 7
**已完成：** 7

## 目标
实现场景二（星空·书签）的核心功能：夜空 + 星星群 + 鼠标交互（hover / click）+ 搜索框 + tooltip。
让"点击 signpost → 进入星空 → 点击星星打开 URL"的完整链路跑通。

## 任务清单

### 任务 3.1 — SkyDome(night) + StarField + Star
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/components/SkyDome.jsx` — variant="night" 深蓝深紫渐变
- `src/components/StarField.jsx` — 程序化散落 N 颗星星
- `src/components/Star.jsx` — 单颗球体 + 暖金发光
- `src/scenes/StarrySky.jsx` — 组合以上

### 任务 3.2 — 星星 hover 效果（放大 + 发光）
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/components/Star.jsx` — onPointerOver / onPointerOut 改 scale + emissive
- 不影响其他星星

### 任务 3.3 — 点击星星打开 URL
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/components/Star.jsx` — onClick → bookmark.url → `window.location.href = url`
- 单元测试覆盖

### 任务 3.4 — 点击小路返回场景一
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/components/Path.jsx` — 在 starry scene 下成为返回触发器
- `src/scenes/StarrySky.jsx` — onPathClick → dispatch SET_SCENE campsite

### 任务 3.5 — SearchBar 搜索框
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/overlays/SearchBar.jsx` — input + 暖色 outline，半透明融入场景色调
- 不抢戏

### 任务 3.6 — Tooltip hover 提示卡
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/overlays/Tooltip.jsx` — 半透明卡片，跟随鼠标
- `src/App.jsx` — 维护 hoverInfo 状态
- hover 200ms 后浮现，移开消失

### 任务 3.7 — 搜索触发 chrome.search.query
**状态：** ✅ 已完成 | **日期：** 2026-06-03
- `src/overlays/SearchBar.jsx` — onSubmit → chrome.search.query
- 单元测试覆盖

## 阶段产出
- 场景二（星空）核心功能完整
- 6 个 overlays 组件（搜索框 / tooltip / 联动）
- 完整双向导航：场景一 ↔ 场景二

## 验证
- ✅ 单元测试通过
- ✅ 浏览器中：点击 signpost → 进入星空 → hover 星星 tooltip → click 打开 URL
- ✅ 点击地面 → 回到场景一
- ✅ 搜索框 Enter → Google 搜索

## 备注
- 场景二当前是"无限远景"，无地面 / 帐篷 / 树
- 未来增强（来自灵感研究）：
  - star 颜色 / 大小可映射 favicon 色相 + 访问频次
  - 引入"夜云缓缓飘过"
  - 引入"小猫角色"作为场景切换引导（CLAUDE.md 设计待定）
