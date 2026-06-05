# 收藏夹可视化 — 设计文档

## 一、开发方法论

### 1.1 SDD（Specification-Driven Development）

本项目采用规格驱动的开发方式：

```
spec.md 编写  →  评审确认  →  按规格实现  →  测试验证  →  交付
    ↑                                                      │
    └──────────── 发现偏差，回溯更新规格 ←──────────────────┘
```

- **spec.md** 是项目的唯一真相源（single source of truth）。所有功能"长什么样"、"怎么交互"、"边界情况如何处理"都在 spec.md 中定义。
- **design.md**（本文档）描述"怎么实现"——架构、流程、Agent 协作方式、技术决策。
- 任何代码变更前，先确认 spec.md 中对应的 GWT 场景是否存在。不存在则先写规格。
- 测试用例直接对应 spec.md 中的 GWT 场景，一一映射、可追溯。

### 1.2 BDD + GWT（Given-When-Then）

所有功能场景采用 GWT 格式描述，写入 spec.md：

```
Given  前置状态（当前场景、数据状态）
When   用户操作（点击、hover、输入）
Then   预期结果（画面变化、状态切换、URL 跳转）
```

**示例——场景切换：**

```
Scenario: 用户从营地进入星空
  Given 用户在场景一（营地）
  And 路牌上显示"开发工具"指示牌
  When 用户点击"开发工具"指示牌
  Then 画面切换至场景二（星空）
  And 夜空中显示"开发工具"文件夹内的所有书签星星
```

GWT 格式的优势：
- 非技术人员也能阅读和确认
- 可以直接翻译为自动化测试用例
- 规格和测试之间没有"翻译损耗"

---

## 二、架构总览

### 2.1 系统分层

```
┌──────────────────────────────────────────────────┐
│                  Chrome Extension                 │
│                                                  │
│  ┌─────────────┐     ┌─────────────────────────┐ │
│  │ manifest.json│────▶│      newtab.html        │ │
│  │ (V3)        │     │  ┌───────────────────┐  │ │
│  └─────────────┘     │  │   React App        │  │ │
│                       │  │  ┌─────────────┐  │  │ │
│  ┌─────────────┐     │  │  │ R3F Canvas   │  │  │ │
│  │ bookmarks   │◀────┼──┤  │ (3D Scenes)  │  │  │ │
│  │ API         │     │  │  └─────────────┘  │  │ │
│  └─────────────┘     │  │  ┌─────────────┐  │  │ │
│                       │  │  │ HTML Overlay │  │  │ │
│  ┌─────────────┐     │  │  │ (SearchBar,  │  │  │ │
│  │ search API  │◀────┼──┤  │  Tooltip)    │  │  │ │
│  └─────────────┘     │  │  └─────────────┘  │  │ │
│                       │  └───────────────────┘  │ │
│                       └─────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

两层渲染：
- **3D Canvas 层**（R3F）—— 场景中的所有立体元素（路牌、星星、天空球、地面、小猫）
- **HTML Overlay 层** —— 叠在 Canvas 之上的 DOM 元素（搜索框、Tooltip）

### 2.2 技术栈

> **最近更新（2026-06-05）：** 详见 `doc/decisions/ADR-002`（技术栈重选）与 `doc/decisions/ADR-004`（场景一方案 C）。
> drei 已从"装而不用"升级为"释放价值"；postprocessing 暂缓；Vite 升 8.0、R3F 升 9.6、three 0.184。

| 层面 | 选择 | 备注 |
|------|------|------|
| 框架 | React 19.x | 组件化状态管理，R3F 的 React 封装 |
| 3D 渲染 | three 0.184 + @react-three/fiber 9.6 | 真 3D 空间；R3F 是 React + Three.js 最佳封装 |
| 3D 工具集 | @react-three/drei 10.7 | **已使用**（见下方"drei 已用清单"） |
| 构建 | Vite 8.0 + @crxjs/vite-plugin 2.4 | build ~280ms，满足 4.5 首帧 < 500ms |
| 扩展标准 | Manifest V3 | Chrome 当前强制标准 |
| 语言 | JavaScript (JSX) | 无类型约束；TS 暂缓（`ADR-002`） |
| 状态管理 | React Context + useReducer | 状态 4 个字段，不需 zustand/jotai |
| 后期效果 | @react-three/postprocessing | **暂缓**（`ADR-002`，+70KB，待 Bayer 量化或 Bloom 需求出现） |
| 调试工具 | maath (`damp3`) | 相机阻尼过渡用（`ADR-002 任务 2.16`） |
| 测试 | Vitest 4 + Playwright + Testing Library | 28 tests + 2 E2E；Playwright 支持扩展环境 |

**drei 已用清单（5 项，0 bundle 增量）**

| drei 子功能 | 用途 | 任务 | ROI |
|------|------|:---:|:---:|
| `<Outlines screenspace>` | 全场景描边（Signpost / SignBoard / Campfire / ForegroundFlowers / SignpostBird / 远景树） | 2.14 | ⭐⭐⭐⭐⭐ |
| `MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter` | 全场景 toon 化 | 2.15 | ⭐⭐⭐⭐⭐ |
| `<PerspectiveCamera>` + makeDefault + maath 阻尼 | 场景切换慢切（1.5-2.0s） | 2.16 | ⭐⭐⭐ |
| `<Text>` | 替代 SignBoard DOM 文字（保持 3D 透视） | 2.17 | ⭐⭐⭐ |
| `<Sparkles>` | 替代自制 Fireflies | 2.18 | ⭐⭐⭐ |

**drei 显式不引入（4 项）**

- `<Float>` —— 与"静止稳重"氛围冲突
- `<Environment>` —— 违反 toon 风格的"无影"原则
- 自定义 Inverted-hull ShaderMaterial —— 有 `<Outlines>` 就够
- 其他（Stars/OrbitControls/Html 等）—— 本项目不需要

**暂缓引入（第二批实施）**

- `@react-three/postprocessing` —— 实施 Bayer 颜色量化或 Bloom 时
- `glsl-noise` / `three-custom-shader-material` —— 实施 SkyDome 域扭曲 fBm 时
- TypeScript —— 代码量翻倍或多人协作出
- Zod / Valibot —— 出现真实 chrome.bookmarks 畸形数据时

### 2.3 组件树

> **场景一方案变更（2026-06-05）：** 改为"静态图 + 3D 浮层"（`ADR-004` 方案 C）。
> 静态图（`public/scenes/campsite-bg.webp`）做画布，3D 元素（路牌/篝火/萤火虫/小鸟/小路）作为浮层叠加在图上。
> 场景二（星空）暂不改变，保持纯 3D 渲染。

```
<App>
├── <AppProvider>                 ← Context: scene, folders, selectedFolder, bookmarks, bgImage
│   │
│   ├── <Canvas>                  ← R3F 3D 画布
│   │   ├── {scene === 'campsite' && <Campsite>}   ← 图片 + 3D 浮层（ADR-004 方案 C）
│   │   │     BackgroundImage / Path / Signpost → SignBoard[]
│   │   │     / Campfire (呼吸+火焰) / Fireflies (Sparkles) / SignpostBird (飞过)
│   │   │
│   │   └── {scene === 'starry'  && <StarrySky>}   ← 保持现状
│   │         SkyDome(night) / StarField → Star[] / Ground / Path / Cat
│   │
│   ├── <SearchBar />             ← HTML 叠加层，始终可见
│   ├── <Tooltip />               ← HTML 叠加层，hover 星星时显示
│   └── <ImagePicker />           ← HTML 叠加层（任务 2.24），popup 选图 / 每日换
```

**场景一元素清单（方案 C 后）**

| 元素 | 类型 | 来源 | z 位置 | 备注 |
|------|------|------|:---:|------|
| BackgroundImage | 静态图 | `public/scenes/campsite-bg.webp` | 0 | 替换 SkyDome/Ground/BackgroundLayers |
| Signpost + SignBoard | 3D 浮层 | 任务 2.14/2.15/2.17 | 1.5 | 沉浸感核心 + 书签交互 |
| Campfire | 3D 浮层 | 任务 2.14/2.15 | 1.0 | 氛围（呼吸+火焰） |
| Fireflies (Sparkles) | 3D 浮层 | 任务 2.18 | 1.0 | 氛围（飘忽+闪烁） |
| SkyBirds (SignpostBird) | 3D 浮层 | 任务 2.14 | 1.0 | 氛围（飞过） |
| Path | 3D 浮层 | 沿用 | 0.5 | 引导线（虽小，沉浸感贡献大） |
| SearchBar / Tooltip / ImagePicker | HTML | 沿用 | ∞ | 功能性 |

**场景一已删除的元素（`ADR-004`）**

- ~~SkyDome(day)~~ —— 图片取代天空
- ~~Ground~~ —— 图片里已有地面
- ~~BackgroundLayers~~（远山/远树/湖）—— 图片里已有
- ~~GrassTufts / ForegroundFlowers~~ —— 图片里已有草地和花
- ~~ScorchMark~~ —— 决定保留或删除（任务 2.22 实施时再定）

### 2.4 数据流

```
chrome.bookmarks.getTree()
        │
        ▼
parseBookmarkTree(rawTree)        ← utils/bookmarks.js
        │
        ▼
AppContext ── folders[] ──────────▶ Campsite 渲染指示牌
        │
        │  用户点击指示牌 → setSelectedFolder(folder)
        ▼
AppContext ── selectedFolder ────▶ StarrySky 渲染星星
        │
        │  用户点击星星 → window.location.href = url
        │  用户点击小路 → setScene('campsite')
```

### 2.5 项目文件结构

> **场景一方案 C 实施后（`ADR-004`）：** 静态资源从 `textures/` 改为 `scenes/`，组件从手绘模拟改为图 + 3D 浮层。
> 加粗/标 ✨ 的为新增/变更项；标 ❌ 的为已删除项。

```
starry-sky-campsite/
├── manifest.json
├── newtab.html
├── vite.config.js
├── package.json
│
├── doc/                          # 项目文档
│   ├── demand.md                 #   需求文档
│   ├── design.md                 #   设计文档（本文件）
│   ├── spec.md                   #   规格文档（GWT 场景）
│   ├── art-style.md              #   画风参考文档
│   ├── decisions/                #   ADR 决策记录（2026-06-05+ 新增）
│   │   ├── ADR-001-chunk-size-warning.md
│   │   ├── ADR-002-tech-stack-reselection.md
│   │   ├── ADR-003-prioritize-scene1-to-reference.md
│   │   └── ADR-004-scene1-photo-plus-3d-overlay.md
│   └── discussions/              #   讨论记录
│
├── agents/                       # Agent 设计文档
│   ├── main-agent.md
│   ├── scene-agent.md
│   ├── data-agent.md
│   ├── ui-agent.md
│   └── test-agent.md
│
├── public/
│   ├── scenes/                   # ✨ 场景背景图（任务 2.21/2.24）
│   │   ├── campsite-bg.webp      #   场景一主背景图（用户提供的图，转 WebP）
│   │   └── campsite-bg-alt-*.webp #   多图轮播候选（任务 2.24）
│   └── textures/                 # ❌ 旧：手绘纹理（场景一方案 C 后不再需要）
│       └── star.png              #   仅星空 star.png 保留
│
└── src/
    ├── main.jsx                  # 入口
    ├── App.jsx                   # 顶层组装
    ├── context/AppContext.jsx    # 全局状态（+ bgImage 字段）
    ├── hooks/
    │   ├── useBookmarks.js       # 书签读取
    │   └── useBackgroundImage.js # ✨ 背景图加载（任务 2.22）
    ├── scenes/
    │   ├── Campsite.jsx          # 场景一：图 + 3D 浮层
    │   └── StarrySky.jsx         # 场景二：保持纯 3D
    ├── components/
    │   ├── ✨ BackgroundImage.jsx   # 营地背景图（任务 2.22）
    │   ├── ❌ SkyDome.jsx            # 场景一不再需要
    │   ├── ❌ Ground.jsx             # 图片里已有地面
    │   ├── ❌ BackgroundLayers.jsx   # 图片里已有远景
    │   ├── ❌ ForegroundFlowers.jsx  # 图片里已有花
    │   ├── Path.jsx              # 引导线（保留）
    │   ├── Signpost.jsx          # 路牌柱（任务 2.14/2.15）
    │   ├── SignBoard.jsx         # 指示牌（任务 2.14/2.15/2.17 用 drei <Text>）
    │   ├── Campfire.jsx          # 篝火（任务 2.14/2.15）
    │   ├── Fireflies.jsx         # ❌ 删除（被 drei <Sparkles> 替代，任务 2.18）
    │   ├── StarField.jsx         # 星空
    │   ├── Star.jsx              # 星星
    │   └── Cat.jsx               # 猫
    ├── overlays/
    │   ├── SearchBar.jsx
    │   ├── Tooltip.jsx
    │   └── ✨ ImagePicker.jsx        # 背景图选择器（任务 2.24）
    └── utils/
        ├── bookmarks.js
        └── ✨ toonGradientMap.js    # 3 阶 toon gradientMap 工具（任务 2.15）
```

---

## 三、Agent 协作模型

项目采用 1 主控 + 4 职能 Agent 的协作架构。各 Agent 的详细设计见 `agents/` 目录。

### 3.1 架构图

```
                    ┌─────────────┐
                    │  main-agent │ (总控)
                    │  任务分解   │
                    │  Agent 调度 │
                    │  代码审查   │
                    │  集成决策   │
                    │  质量把关   │
                    └──┬──┬──┬──┘
                       │  │  │
          ┌────────────┘  │  │  └────────────┐
          ▼               ▼  ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ scene-agent  │ │ data-agent   │ │  ui-agent    │ │ test-agent   │
│ 3D 场景开发  │ │ 数据层开发   │ │ HTML 叠加层  │ │ 测试         │
│              │ │              │ │              │ │              │
│ ·Campsite    │ │ ·书签 API    │ │ ·SearchBar   │ │ ·Vitest 配置 │
│ ·StarrySky   │ │ ·解析函数    │ │ ·Tooltip     │ │ ·单元测试    │
│ ·所有3D组件  │ │ ·Context状态  │ │ ·CSS 样式    │ │ ·组件测试    │
│ ·灯光/相机   │ │ ·Mock 数据   │ │ ·定位逻辑    │ │ ·集成测试    │
│ ·动画/材质   │ │ ·搜索触发    │ │ ·可访问性    │ │ ·Playwright  │
│ ·画风执行    │ │              │ │              │ │ ·GWT→测试    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 3.2 各 Agent 职能

#### main-agent（总控）

- **任务分解：** 将 spec.md 中的 GWT 场景拆分为可分配给子 Agent 的开发任务
- **Agent 调度：** 决定任务的执行顺序和并行策略
- **代码审查：** 审查所有子 Agent 的输出，确保符合 spec 和画风要求
- **集成决策：** 解决 Agent 间的接口争议，做出最终技术决策
- **质量把关：** 对照 art-style.md 审查画面效果，不通过则打回

#### scene-agent（3D 场景）

- **负责范围：** `scenes/`、`components/`（3D 组件）、灯光、相机、动画、材质
- **核心任务：** Campsite、StarrySky、Ground、Path、SkyDome、Signpost、SignBoard、StarField、Star、Cat
- **关注点：** 画面精美度、动画流畅度、画风一致性（对照 art-style.md）
- **不负责：** HTML Overlay、数据获取、状态管理

#### data-agent（数据层）

- **负责范围：** `utils/bookmarks.js`、`hooks/useBookmarks.js`、`context/AppContext.jsx`
- **核心任务：** chrome.bookmarks API 封装、书签树解析、状态管理、Mock 数据、搜索触发
- **关注点：** 数据正确性、空状态/边界情况、Chrome 扩展环境兼容
- **不负责：** 任何视觉渲染

#### ui-agent（HTML 叠加层）

- **负责范围：** `overlays/`、HTML/CSS
- **核心任务：** SearchBar（外观 + 搜索触发）、Tooltip（定位 + 内容展示）
- **关注点：** 融入场景画面不突兀、响应式、可访问性
- **不负责：** 3D Canvas 内的任何内容

#### test-agent（测试）

- **负责范围：** 全部测试基础设施和测试用例
- **核心任务：**
  - Vitest 配置（单元/组件/集成测试）
  - Playwright 配置（E2E 测试，含 Chrome 扩展环境）
  - 将 spec.md 的 GWT 场景翻译为测试用例
  - 视觉回归测试（Playwright screenshots）
- **关注点：** 测试覆盖率、GWT 可追溯性、CI 可运行

### 3.3 协作流程

```
1. spec.md 新增/修改 GWT 场景
       │
2. main-agent 评审 GWT，拆分为任务
       │
3. main-agent 将任务分派给对应的子 Agent
       │
4. 子 Agent 独立开发（各自在自己的域内工作）
       │
5. 子 Agent 提交代码
       │
6. test-agent 运行测试，对照 GWT 验证
       │
7. main-agent 审查代码 + 画面效果
   ├── 通过 → 合并
   └── 不通过 → 打回修改
```

---

## 四、测试策略

### 4.1 测试工具

| 层级 | 工具 | 用途 |
|------|------|------|
| 单元测试 | Vitest | 纯函数测试（书签解析、布局算法） |
| 组件测试 | Vitest + @testing-library/react | React 组件渲染和交互测试 |
| 集成测试 | Vitest | Hook + Context + 数据流测试 |
| E2E 测试 | Playwright | 完整扩展环境中的端到端测试 |
| 视觉回归 | Playwright screenshots | 截图对比，验证画面渲染正确 |

**选择理由：**
- **Vitest** — 与 Vite 原生集成，零配置，速度快，API 兼容 Jest
- **@testing-library/react** — React 社区标准，以用户视角测试组件
- **Playwright** — 支持 `--disable-extensions-except` 加载未打包扩展，`persistentContext` 保持扩展状态，是测试 Chrome 扩展的最佳选择

### 4.2 测试金字塔

```
         ╱  E2E  ╲         场景切换、书签读取、搜索流程
        ╱   集成   ╲        Hook + Context 数据流
       ╱    组件    ╲       SignBoard、Star、SearchBar 交互
      ╱────── 单元 ──────╲   parseBookmarkTree、坐标计算、种子随机
```

### 4.3 GWT → 测试用例映射

spec.md 中的每一条 GWT 场景，必须至少对应一条自动化测试：

```
spec.md:                      test:
Given 用户在场景一            beforeEach: scene = 'campsite'
When 点击指示牌               fireEvent.click(signBoard)
Then 切换至场景二             expect(scene).toBe('starry')
```

test-agent 负责维护这个映射关系的完整性。

### 4.4 E2E 测试环境

Playwright 配置要点：
- 使用 `persistentContext` 保持扩展加载状态
- 启动参数 `--disable-extensions-except=<extension-path>` 加载未打包扩展
- Mock `chrome.bookmarks` API（通过 `chrome.debugger` 或预置书签 Profile）
- 覆盖关键用户旅程：打开新标签页 → 看到营地 → 点击路牌 → 看到星空 → 点击星星 → URL 跳转

---

## 五、开发阶段

### 阶段 0：规格确认（当前阶段）

- [ ] **spec.md** 编写完成，所有 GWT 场景覆盖 MVP 功能
- [ ] 用户确认 spec.md
- [ ] **agents/** 下各 Agent 设计文档编写完成
- [ ] 用户确认 Agent 设计方案

### 阶段 1：项目骨架（scene-agent + data-agent + test-agent 并行启动）

- [ ] Vite + React + R3F 项目初始化
- [ ] `@crxjs/vite-plugin` 扩展打包配置
- [ ] `manifest.json`、`newtab.html` 创建
- [ ] Vitest + Playwright 测试基础设施搭建
- [ ] Chrome 中加载未打包扩展，确认新标签页替换正常

### 阶段 2：数据层 + 场景一（data-agent + scene-agent 并行）

> **2026-06-05 重大变更：** 场景一从"纯 3D 渲染"改为"静态图 + 3D 浮层"（方案 C，`ADR-004`）。
> 任务清单做对应调整：删除 2.19/2.20；新增 2.21-2.25；保留 2.14-2.18（drei 价值释放）。

#### 已完成（v1）

- [x] 书签解析函数 + Mock 数据
- [x] AppContext 状态管理
- [x] 营地基础场景（地面 + 小路 + 天空）—— **v1 形态，方案 C 后地面/天空被图替代**
- [x] 路牌柱 + 指示牌 + 文字
- [x] 光照调试
- [x] 点击路牌切换场景

#### 升级任务（v2，对应 `ADR-002` / `ADR-003` / `ADR-004`）

**第一批：材质与描边（材质分 +3）**

- [ ] **2.14** drei `<Outlines screenspace>` 包裹 Signpost / SignBoard / Campfire / ForegroundFlowers / SignpostBird / 远景树（`ADR-002` ⭐⭐⭐⭐⭐）
- [ ] **2.15** 全场景 `MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter`，新建 `utils/toonGradientMap.js`（`ADR-002` ⭐⭐⭐⭐⭐）

**第二批：体验与立体感（体验分 +1）**

- [ ] **2.16** 场景切换相机阻尼过渡（drei `<PerspectiveCamera>` + maath `damp3`），1.5-2.0s（`ADR-002` ⭐⭐⭐）
- [ ] **2.17** drei `<Text>` 替代 SignBoard DOM 文字（`ADR-002` ⭐⭐⭐）
- [ ] **2.18** drei `<Sparkles>` 替代自制 Fireflies（`ADR-002` ⭐⭐⭐）

**第三批：方案 C 资源与标定（`ADR-004` ⭐⭐⭐⭐）**

- [ ] **2.21** 准备图资源（用户提供原始图 → 转 WebP + 压缩，3840×2160，色调与 `art-style.md §4.3` 对齐）
- [ ] **2.22** BackgroundImage 组件（`PlaneGeometry` + 纹理加载），替换 SkyDome + Ground + BackgroundLayers
- [ ] **2.23** 标定 3D 元素在图上的位置（关键成本——每张图需手工标定）
- [ ] **2.24** 多图支持：popup 选图 + 每日换（Are.na 风格的"每日一图"）
- [ ] **2.25** 视觉回归（对照参考图，验收）

**已删除**（`ADR-004` 取代 `ADR-003` 的纯 3D 升级路线）

- ❌ ~~2.19 加湖面~~ —— 图片里已有湖面
- ❌ ~~2.20 远景树丛/远山改 billboard impostor~~ —— 图片里已有远景

### 阶段 3：场景二 + UI 叠加层（scene-agent + ui-agent 并行）

- [ ] 夜空 + 星空系统 + 星星
- [ ] 搜索框 HTML 叠加层
- [ ] Tooltip hover 提示
- [ ] 点击星星打开 URL
- [ ] 点击小路返回场景一

### 阶段 4：测试 + 打磨（test-agent 主导 + main-agent 审查）

- [ ] 全部 GWT 场景对应的自动化测试通过
- [ ] E2E 用户旅程测试通过
- [ ] 视觉回归截图对比
- [ ] 画风审查（对照 art-style.md）
- [ ] 性能优化（首帧 < 500ms）

### 阶段 5：交付

- [ ] 打包 Chrome 扩展
- [ ] 验收测试清单逐项通过

---

## 六、技术决策

### 6.1 关键决策记录

> **最近更新（2026-06-05）：** 详见 `doc/decisions/`。
> - `ADR-002` — drei 5 项已使用 / postprocessing 暂缓
> - `ADR-003` — 交付优先级：先攻场景一达参考图水准
> - `ADR-004` — 场景一方案 C：静态图 + 3D 浮层

| 决策 | 选择 | 理由 | ADR |
|------|------|------|:---:|
| 渲染方案 | Three.js + R3F | 真 3D 透视是核心体验（小猫沿路行走需要真实 Z 轴深度），CSS 2D 方案无法满足 | — |
| **场景一构成** | **静态图 + 3D 浮层（方案 C）** | 用代码还原一张图天然有"插画感不足"短板（材质分 5/9）；图片 + 3D 浮层综合分 8.5 vs 纯 3D 7.5 | `ADR-004` |
| **场景一图片来源** | **用户提供** | 个性化温度 + 避免 AI 生成不稳定 + 版权清晰 | `ADR-004` |
| 画风实现 | Toon Shader 模拟 2D 手绘 | 参考罗小黑"无影平涂"风格，`MeshToonMaterial` + 3 阶 `gradientMap` 最接近手绘"平涂"质感 | `ADR-002` |
| **画风描边实现** | **drei `<Outlines screenspace>`** | 统一描边方案；当前 SignBoard canvas wobble "看着像"但远景树丛/篝火/小鸟无描边 | `ADR-002` |
| 状态管理 | React Context | 状态量少（scene + folders + selectedFolder + bgImage），不需要 Redux/Zustand | — |
| **场景切换时序** | **drei `<PerspectiveCamera>` + maath `damp3` 阻尼过渡（1.5-2.0s）** | 替代 MVP 阶段的"瞬时切换"；`ADR-002` 任务 2.16 | `ADR-002` |
| 搜索实现 | chrome.search.query | 触发浏览器默认搜索引擎，不自己实现搜索 | — |
| 书签读取 | 仅一级文件夹 + 直接子书签 | 扁平化，避免嵌套复杂度 | — |
| 构建工具 | Vite 8.0 + @crxjs/vite-plugin 2.4 | 一键打包扩展，HMR 支持；build ~280ms 满足 4.5 首帧 < 500ms | `ADR-002` |
| 无路由库 | state 驱动场景切换 | 只有两个场景，用 `scene` 状态切换比引入 React Router 更简单 | — |
| **postprocessing** | **暂缓（第二批）** | MVP 不需要；待 Bayer 颜色量化或 Bloom 需求出现 | `ADR-002` |
| **TypeScript 迁移** | **暂缓** | 当前 28 测试通过；TS 改造 ROI 低 | `ADR-002` |

### 6.2 Chrome 扩展约束

- 新标签页无法使用 `window.open`，打开书签用 `window.location.href` 在当前页跳转
- `@crxjs/vite-plugin` 支持 HMR，修改代码后扩展自动刷新
- 首帧渲染目标 < 500ms（新标签页打开速度是关键指标）
- 权限仅需 `bookmarks` + `search`，无 `host_permissions`

---

## 七、文档体系

```
doc/
├── demand.md          ← 需求文档（产品要做什么，用户看到什么）
├── design.md          ← 设计文档（怎么实现，本文档）
├── spec.md            ← 规格文档（GWT 场景、验收标准）
├── art-style.md       ← 画风参考（罗小黑风格分析 + 本项目设计指导）
├── scene-design.md    ← 场景画面设计（构图、比例、相机、元素布局）
├── decisions/         ← 决策记录（ADR）✨ 2026-06-05 新增
│   ├── ADR-001-chunk-size-warning.md
│   ├── ADR-002-tech-stack-reselection.md
│   ├── ADR-003-prioritize-scene1-to-reference.md
│   └── ADR-004-scene1-photo-plus-3d-overlay.md
└── discussions/       ← 讨论记录
    ├── 001-animation-basics.md
    ├── 002-forest-extension-analysis.md
    └── 003-tech-stack-reselection.md   ← ADR-002 来源

agents/
├── main-agent.md      ← 主控 Agent 设计 【待编写】
├── scene-agent.md     ← 3D 场景 Agent 设计 【待编写】
├── data-agent.md      ← 数据层 Agent 设计 【待编写】
├── ui-agent.md        ← HTML 叠加层 Agent 设计 【待编写】
└── test-agent.md      ← 测试 Agent 设计 【待编写】
```

### 文档关系

```
demand.md ──→ spec.md ──→ 实现代码
                  │
art-style.md ─────┤      ← 画面效果的验收标准
                  │
design.md ────────┘      ← 架构和流程约束
                  │
agents/*.md ──────┘      ← Agent 之间的协作规则
                  │
decisions/ADR ───┘       ← 关键技术决策（含决策背景 / 备选 / 后果）
```

- **用户** 主要阅读 demand.md + art-style.md（确认产品和画风方向）
- **Agent** 主要阅读 spec.md + design.md + agents/*.md（知道做什么和怎么做）
- **新决策** 必须先写 `decisions/ADR-NNN-*.md` 再同步到 design.md / spec.md
- **spec.md 是唯一的验收标准**，所有 Agent 以它为基准
