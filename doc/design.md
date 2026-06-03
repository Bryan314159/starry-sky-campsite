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

| 层面 | 选择 | 理由 |
|------|------|------|
| 框架 | React 19.x | 组件化状态管理，R3F 的 React 封装 |
| 3D 渲染 | Three.js + @react-three/fiber | 真 3D 空间，真实透视和光照 |
| 3D 工具集 | @react-three/drei | 天空球、文字、射线检测等便捷封装 |
| 构建 | Vite 6.x + @crxjs/vite-plugin | 构建快，一键打包 Chrome 扩展 |
| 扩展标准 | Manifest V3 | Chrome 当前强制标准 |
| 语言 | JavaScript (JSX) | 无类型约束，快速开发 |
| 状态管理 | React Context + useReducer | 状态简单，无需引入外部库 |
| 后期效果 | @react-three/postprocessing | 后续阶段加轮廓线、色彩分级 |

### 2.3 组件树

```
<App>
├── <AppProvider>                 ← Context: scene, folders, selectedFolder, bookmarks
│   │
│   ├── <Canvas>                  ← R3F 3D 画布
│   │   ├── {scene === 'campsite' && <Campsite>}
│   │   │     SkyDome(day) / Ground / Path / Signpost → SignBoard[]
│   │   │
│   │   └── {scene === 'starry'  && <StarrySky>}
│   │         SkyDome(night) / StarField → Star[] / Ground / Path / Cat
│   │
│   ├── <SearchBar />             ← HTML 叠加层，始终可见
│   └── <Tooltip />               ← HTML 叠加层，hover 星星时显示
```

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
│   └── discussions/              #   讨论记录
│
├── agents/                       # Agent 设计文档
│   ├── main-agent.md
│   ├── scene-agent.md
│   ├── data-agent.md
│   ├── ui-agent.md
│   └── test-agent.md
│
├── public/textures/              # 手绘纹理静态资源
│   ├── grass.png
│   ├── wood.png
│   ├── sky-day.png
│   ├── sky-night.png
│   ├── signboard-blank.png
│   └── star.png
│
└── src/
    ├── main.jsx                  # 入口
    ├── App.jsx                   # 顶层组装
    ├── context/AppContext.jsx    # 全局状态
    ├── hooks/useBookmarks.js     # 书签读取
    ├── scenes/
    │   ├── Campsite.jsx
    │   └── StarrySky.jsx
    ├── components/
    │   ├── Ground.jsx
    │   ├── Path.jsx
    │   ├── SkyDome.jsx
    │   ├── Signpost.jsx
    │   ├── SignBoard.jsx
    │   ├── StarField.jsx
    │   ├── Star.jsx
    │   └── Cat.jsx
    ├── overlays/
    │   ├── SearchBar.jsx
    │   └── Tooltip.jsx
    └── utils/bookmarks.js
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

- [ ] 书签解析函数 + Mock 数据
- [ ] AppContext 状态管理
- [ ] 营地基础场景（地面 + 小路 + 天空）
- [ ] 路牌柱 + 指示牌 + 文字
- [ ] 光照调试
- [ ] 点击路牌切换场景

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

| 决策 | 选择 | 理由 |
|------|------|------|
| 渲染方案 | Three.js + R3F | 真 3D 透视是核心体验（小猫沿路行走需要真实 Z 轴深度），CSS 2D 方案无法满足 |
| 画风实现 | Toon Shader 模拟 2D 手绘 | 参考罗小黑"无影平涂"风格，`MeshToonMaterial` 天然是 2-3 阶色阶，最接近手绘"平涂"质感 |
| 状态管理 | React Context | 状态量少（scene + folders + selectedFolder），不需要 Redux/Zustand |
| 场景切换 MVP | 瞬时切换 | 先保证功能完整、加载快速，过场动画延后 |
| 搜索实现 | chrome.search.query | 触发浏览器默认搜索引擎，不自己实现搜索 |
| 书签读取 | 仅一级文件夹 + 直接子书签 | 扁平化，避免嵌套复杂度 |
| 构建工具 | Vite + @crxjs/vite-plugin | 一键打包扩展，HMR 支持 |
| 无路由库 | state 驱动场景切换 | 只有两个场景，用 `scene` 状态切换比引入 React Router 更简单 |

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
├── spec.md            ← 规格文档（GWT 场景、验收标准，【待编写】）
├── art-style.md       ← 画风参考（罗小黑风格分析 + 本项目设计指导）
└── discussions/       ← 讨论记录
    ├── 001-animation-basics.md
    └── 002-forest-extension-analysis.md

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
```

- **用户** 主要阅读 demand.md + art-style.md（确认产品和画风方向）
- **Agent** 主要阅读 spec.md + design.md + agents/*.md（知道做什么和怎么做）
- **spec.md 是唯一的验收标准**，所有 Agent 以它为基准
