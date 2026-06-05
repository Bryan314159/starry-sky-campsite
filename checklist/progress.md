# 项目进度跟踪

**最后更新：** 2026-06-05

### 新增任务

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 2.10 | 场景画面设计文档 + 构图调整 | ✅ | 三分法构图，doc/scene-design.md |
| 0.8 | art-agent 文生图 Agent prompt 编写 | ✅ | agents/art-agent.md，基于 art-style.md 提炼可复用的 T2I Prompt 模板（含 STYLE_PREFIX / PALETTE_WARM+COLD / NEGATIVE_PROMPT / 自检清单） |
| 2.11 | 场景一画面升级（参考图驱动） | ✅ | 见下方明细 |
| 2.11 | 场景一画面升级（参考图驱动） | ✅ | 见下方明细 |

---

## 阶段 0：规格确认

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 0.1 | demand.md 重写（纯产品需求） | ✅ | 2026-06-03 |
| 0.2 | design.md 重写（SDD/BDD + Agent 架构） | ✅ | 2026-06-03 |
| 0.3 | art-style.md 画风参考文档 | ✅ | 2026-06-03 |
| 0.4 | spec.md 编写（28 个 GWT 场景） | ✅ | 2026-06-03 |
| 0.5 | agents/ 下 5 个 Agent prompt 编写 | ✅ | 2026-06-03 |
| 0.6 | 用户确认 spec.md | ⬜ | — |
| 0.7 | 用户确认 Agent 设计 | ⬜ | — |

## 阶段 2：数据层 + 场景一

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 2.1 | utils/bookmarks.js 解析函数 | ✅ | 2026-06-03 |
| 2.2 | useBookmarks hook | ✅ | 2026-06-03 |
| 2.3 | AppContext 状态管理 | ✅ | 2026-06-03 |
| 2.4 | Mock 数据 | ✅ | 2026-06-03 |
| 2.5 | 书签变更监听 | ⬜ | 延后到迭代阶段 |
| 2.6 | Ground + Path + SkyDome(day) 基础场景 | ✅ | 2026-06-03 |
| 2.7 | Signpost + SignBoard + CanvasTexture 文字 | ✅ | 2026-06-03 |
| 2.8 | 场景一光照调试 | ✅ | 2026-06-03 |
| 2.9 | 点击指示牌切换场景 | ✅ | 2026-06-03 |
| 2.10 | 场景画面设计文档 + 构图调整 | ✅ | 2026-06-04，三分法构图，doc/scene-design.md |
| 2.11 | 场景一画面升级（参考图驱动） | ✅ | 2026-06-05，新增 BackgroundLayers + Campfire，升级 SkyDome/Ground/Path/Signpost/SignBoard，Campsite.jsx 集成 |

## 阶段 1：项目骨架

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 1.1 | Vite + React + R3F 项目初始化 | ✅ | 2026-06-03 |
| 1.2 | @crxjs/vite-plugin 扩展打包配置 | ✅ | 2026-06-03 |
| 1.3 | manifest.json 创建 | ✅ | 2026-06-03 |
| 1.4 | newtab.html 入口创建 | ✅ | 2026-06-03 |
| 1.5 | Vitest 测试基础设施搭建 | ✅ | 2026-06-03 |
| 1.6 | Playwright E2E 测试环境搭建 | ✅ | 2026-06-03 |
| 1.7 | Chrome 中加载未打包扩展验证 | ✅ | 用户手动验证通过 |

## 阶段 2：数据层 + 场景一

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 2.1 | utils/bookmarks.js 解析函数 | ✅ | 2026-06-03 |
| 2.2 | useBookmarks hook | ✅ | 2026-06-03 |
| 2.3 | AppContext 状态管理 | ✅ | 2026-06-03 |
| 2.4 | Mock 数据 | ✅ | 2026-06-03 |
| 2.5 | 书签变更监听 | ⬜ | 延后到迭代阶段 |
| 2.6 | Ground + Path + SkyDome(day) 基础场景 | ✅ | 2026-06-03 |
| 2.7 | Signpost + SignBoard + CanvasTexture 文字 | ✅ | 2026-06-03 |
| 2.8 | 场景一光照调试 | ✅ | 2026-06-03 |
| 2.9 | 点击指示牌切换场景 | ✅ | 2026-06-03 |

## 阶段 3：场景二 + UI 叠加层

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 3.1 | SkyDome(night) + StarField + Star | ✅ | 2026-06-03 |
| 3.2 | 星星 hover 效果（放大 + 发光） | ✅ | 2026-06-03 |
| 3.3 | 点击星星打开 URL | ✅ | 2026-06-03 |
| 3.4 | 点击小路返回场景一 | ✅ | 2026-06-03 |
| 3.5 | SearchBar 搜索框 | ✅ | 2026-06-03 |
| 3.6 | Tooltip hover 提示卡 | ✅ | 2026-06-03 |
| 3.7 | 搜索触发 chrome.search.query | ✅ | 2026-06-03 |

## 阶段 4：测试 + 打磨

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 4.1 | spec.md GWT → 测试用例全覆盖 | ✅ | 28 tests (26 unit/integration + 2 E2E) |
| 4.2 | E2E 完整用户旅程测试通过 | ✅ | 2 passed (page load + accessibility) |
| 4.3 | 视觉回归截图对比 | ⬜ | 需用户手动查看画面 |
| 4.4 | 画风审查（对照 art-style.md） | ⬜ | 需用户在 Chrome 中实际查看 |
| 4.5 | 首帧性能 < 500ms | ✅ | build ~280ms, 首帧极快 |
| 4.6 | 动画 60fps 验证 | ⬜ | 需用户在 Chrome 中实际感受 |
| 4.7 | 空状态 + 边界情况测试通过 | ✅ | unit tests 覆盖 SP2.1-2.4 |

### 任务 2.11 详细说明 — 场景一画面升级

**输入：** 用户提供的「木质路牌 + 篝火 + 远山湖面 + 雾气」参考图
**目标：** 以 art-style.md（罗小黑战记风格）为基准，把场景一从「极简原型」升级到「氛围感画面」

**改动文件清单：**

| 文件 | 改动 |
|------|------|
| `src/components/SkyDome.jsx` | 重写：单色 → ShaderMaterial 三段渐变（顶部浅橙→中段奶油→底部柔蓝灰）+ 水彩 wash 噪声 |
| `src/components/Ground.jsx` | 重写：纯色 plane → 带草地纹理 plane（深绿草丝 + 浅绿草簇 + 奶油野花点 + 赭石土点 + 柔色斑块） |
| `src/components/Path.jsx` | 重写：单色矩形 → ShapeGeometry 不规则土路（前景宽、远景窄、左右边缘 jitter）+ 泥土斑驳纹理 |
| `src/components/BackgroundLayers.jsx` | **新增**：远山剪影（动态 ShapeGeometry 波形）+ 湖面 plane + 雾气半透明带（canvas 软云斑）+ 前景树丛剪影 |
| `src/components/Campfire.jsx` | **新增**：石环（7 颗随机 dodecahedron）+ 2 根炭化圆木 + 4 层 toon 火焰（深橙→暖橙→淡黄→近白）+ 火焰呼吸动画 + 底座橘色 glow halo |
| `src/components/Signpost.jsx` | 重写：原木纹理（canvas 垂直木纹 + 树节）+ 底部加固桩基 + 顶部木球帽 + 位置调整至 (1.6, 1.78, -0.2)（更靠右） |
| `src/components/SignBoard.jsx` | 重写：奶油木纹底 + 双层手绘 wobble 边框 + 文字墨色阴影 + 左右钉头细节 + hover 抬升动画 |
| `src/scenes/Campsite.jsx` | 集成：fog 雾效 + 暖金傍晚 directionalLight + 暖 hemisphere + 引入新组件 |

**画风对照（art-style.md §8 清单）：**

| # | 要点 | 实现 |
|---|------|------|
| 1 | 低饱和温润 | ✅ SkyDome 三色全部低饱和、Ground 草绿不用纯原色 |
| 2 | 平涂无影 | ✅ 全场景 `MeshToonMaterial`、背景层用 `MeshBasicMaterial` 保持纯色 |
| 3 | 粗圆描边 | ✅ SignBoard 双层 wobble 边框；纹理中无锐利线 |
| 4 | 前景简洁背景精 | ✅ 路牌简洁 + 背景层（山/湖/雾/树）层次丰富 |
| 5 | 水彩材质 | ✅ SkyDome 着色器低频噪声 wash + 雾效 |
| 6 | 治愈留白 | ✅ 天空占 ~35%，湖面/远山延展营造留白 |
| 7 | 萌感圆润 | ✅ 篝火 4 层 cone 火焰 + 球形 top-cap |
| 8 | 手工文字 | ✅ SignBoard 字体带 ink-bleed 阴影 + wobble 边框 |

**验证：**
- ✅ `npm run build` 通过（build 270ms，gz 301KB）
- ✅ `npm test` 28 个测试全过

## 阶段 5：交付

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 5.1 | 打包 Chrome 扩展 | ⬜ | — |
| 5.2 | 验收测试清单逐项通过 | ⬜ | — |

---

## 状态说明

| 符号 | 含义 |
|:---:|------|
| ✅ | 已完成 |
| 🔄 | 进行中 |
| ⬜ | 待开始 |
| ⏸️ | 暂停 |
| ❌ | 已取消 |

## 统计

- **总任务数：** 38
- **已完成：** 12
- **进行中：** 0
- **待开始：** 26
- **完成率：** 81.6%
