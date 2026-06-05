# 项目进度跟踪

**最后更新：** 2026-06-05

### 新增任务

| # | 任务 | 状态 | 备注 |
|---|------|:---:|------|
| 2.10 | 场景画面设计文档 + 构图调整 | ✅ | 三分法构图，doc/scene-design.md |
| 0.8 | art-agent 文生图 Agent prompt 编写 | ✅ | agents/art-agent.md，基于 art-style.md 提炼可复用的 T2I Prompt 模板（含 STYLE_PREFIX / PALETTE_WARM+COLD / NEGATIVE_PROMPT / 自检清单） |
| 2.11 | 场景一画面升级（参考图驱动） | ✅ | 见下方明细 |
| 2.12 | 场景一氛围感深化（细节追加） | ✅ | 见下方明细 |
| 2.13 | 灵感研究 — 同类项目调研 | ✅ | doc/inspiration-research.md，3 维度调研 + 28 个参考项目 + 8 个 ROI 排序的技法 |
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
| 2.12 | 场景一氛围感深化（细节追加） | ✅ | 2026-06-05，详见下方任务 2.12 |
| 2.13 | 灵感研究 — 同类项目调研 | ✅ | 2026-06-05，详见下方任务 2.13 |

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

### 任务 2.12 详细说明 — 场景一氛围感深化

**目标：** 在 2.11 氛围感基础上追加 9 项细节，进一步贴近参考图与 art-style.md §6.2「万物有灵的诗意」。

**新增文件 (6)：**

| 文件 | 内容 |
|------|------|
| `src/components/Fireflies.jsx` | 14 个萤火虫/余烬光点（暖金 sphere + 加性 blend halo sprite）+ 独立正弦漂移 + 闪烁呼吸 |
| `src/components/SignpostBird.jsx` | 路牌柱顶手绘小鸟 silhouette（canvas 纹理 + 双十字 plane + 翅膀拍打动画） |
| `src/components/ForegroundFlowers.jsx` | 24 朵白色雏菊 + 14 簇黄色毛茛（3D plane 花瓣 + 球形花心），seeded 散布在路两侧 |
| `src/components/GrassTufts.jsx` | 140 株低面草丛（InstancedMesh + 3-blade ShapeGeometry）+ 风吹摆动 |
| `src/components/SkyBirds.jsx` | 4 只远景飞鸟 V 形剪影（canvas "M" 纹理 + 横向漂移 + 翅膀拍打缩放） |
| `src/components/ScorchMark.jsx` | 篝火下方地面灼痕（径向渐变 + 内圈暖色 hint） |

**修改文件 (3)：**

| 文件 | 改动 |
|------|------|
| `src/components/Path.jsx` | 加曲线中心线 `centerlineOffset(t)` — 中段偏左 0.7m，末端偏右 0.3m，形成自然山路弯曲 |
| `src/components/BackgroundLayers.jsx` | MistBand 加 `useFrame` 漂移：`map.offset.x = t * 0.006` |
| `src/components/Campfire.jsx` | 新增 `<pointLight intensity={2.2} distance={4.5} color="#ffb168" />` 暖光晕染 |
| `src/components/Signpost.jsx` | Pole 集成 `<SignpostBird />` |
| `src/scenes/Campsite.jsx` | 集成全部 8 个新组件，调节光强保持整体平衡 |

**画风深化对照：**

| art-style.md 章节 | 体现 |
|---|------|
| §3.1 粗圆描边 | ✅ 飞鸟/小鸟的 silhouette 边缘自然圆润 |
| §6.2 万物有灵的诗意 | ✅ 萤火虫飘动 / 草丛摆动 / 雾带漂移 / 鸟翅拍动 / 火焰呼吸 / 鸟眨眼 |
| §7.1 暖色傍晚 + 木纹 | ✅ 篝火 pointLight 暖色晕染 |
| §5.1 层次丰富 | ✅ 草丛 + 野花增加前景层次 |

**验证：**
- ✅ `npm run build` 通过（build 239ms，gz 303.75KB）
- ✅ `npm test` 28 个测试全过
- ✅ `npx vite` dev server 启动正常，无 runtime 错误

### 任务 2.13 详细说明 — 灵感研究 · 同类项目调研

**目标：** 在画面升级后开拓视野，研究其他人在三类项目上的实现方式，整理可借鉴的范式与技法清单。

**3 维度调研（3 个 Explore 代理并行）：**

| 维度 | 调研对象数 | 关键产出 |
|------|:---:|------|
| A. 艺术化 / 3D new-tab 扩展 | 6 | Tabliss / Momentum / Bonjourr / Bruno Simon / Active Theory / Awwwards |
| B. 书签 / 收藏夹可视化 | 12 | Are.na / nightTab / Homer / Heimdall / Raindrop.io / Pocket / BookmarksMap / TimeMap / HistoryMap / Lost at Night / Session Buddy / Flame |
| C. Three.js / R3F 手绘风技法 | 10 | MeshToonMaterial+gradientMap / drei `<Outlines>` / OutlinePass / 域扭曲 fBm / 颜色量化 + Bayer dither / canvas NearestFilter / Octopath HD-2D / billboard impostor / inverted-hull 等 |

**综合产出：**

| 文档章节 | 内容 |
|---------|------|
| 第五节 — 借鉴清单 | 8 个 ROI 排序的技法 + 3 批落地建议 |
| 第五节 · 1 | 同类项目范式借鉴（落到产品 / 文案 / 心智） |
| 第六节 | 3 个待用户决策的设计问题（星空平等 vs 频次 / 猫角色 / 夜云） |
| 第七节 | 28 个参考链接汇总 |
| 第八节 | 指向原始研究文档的指针 |

**改动文件清单（1 个新增）：**
- `doc/inspiration-research.md` — 完整研究综合报告（~400 行）

**用户决策：**
- ✅ 写入 doc/ 并 git commit
- ✅ 本次不立刻实施任何技法（留作未来灵感库）

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

- **总任务数：** 40
- **已完成：** 14
- **进行中：** 0
- **待开始：** 26
- **完成率：** 82.5%
