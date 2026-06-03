# 讨论 002：my-forest-extension 方案解析 & 两项目对比

**日期：** 2026-06-03

**关联：** [[001-animation-basics]]

---

## 一、my-forest-extension 项目解析

### 1.1 基本信息

| 属性 | 值 |
|------|-----|
| 形态 | Chrome 扩展 Manifest V3，新标签页 |
| 代码量 | 约 440 行 JS + 1050 行 CSS，单文件，零构建 |
| 技术栈 | **纯 HTML + CSS + Vanilla JS**（无 React、无 Three.js、无 Vite） |
| 依赖 | 零外部依赖，无 CDN、无远程脚本 |
| 素材 | 约 26 张 PNG 图片（背景图、星球、路牌、落叶、星光） |

### 1.2 技术架构

```
场景一（森林·路牌）          场景二（星空·星球）
    │                              │
    ▼                              ▼
┌─────────────┐            ┌─────────────┐
│ 背景PNG大图  │            │ 背景PNG大图  │
│ + CSS定位    │            │ + CSS定位    │
│   路牌PNG    │            │   星球PNG    │
│   文字span   │            │   文字span   │
└─────────────┘            └─────────────┘
         │                        │
         └────────┬───────────────┘
                  │
         转场：CSS @keyframes
         森林 surface → 下沉/缩放/变暗
         夜空 surface → 渐显/放大
         星星 span → 逐个弹出
```

**核心模式：** DOM 驱动的 2D 场景。所有"画面"是一张张 PNG 图片通过 CSS 定位叠加而成，所有"动画"是 CSS keyframes 对 DOM 元素做 transform/opacity 变换。

### 1.3 场景一实现细节

```
森林场景结构：
  <section class="forest-scene">
    <div class="forest-bg-layer">           ← 全幅森林PNG背景（1.5MB）
    <div class="falling-leaves">             ← 18个落叶PNG，CSS动画飘落
    <div class="sign-area">
      <img class="sign-pole" />              ← 路牌柱PNG（245KB）
      <div class="boards">
        <button class="sign-board">          ← 每块牌子是一个button
          <img board-left/right.png />       ← 左/右朝向的木板PNG
          <span class="board-title">文字</span>  ← HTML span写字
        </button>
      </div>
    </div>
    <div class="forest-pager">               ← 分页按钮
  </section>
```

路牌的"3D感"是怎么来的？
- 路牌柱和木板是**画好的 PNG 图片**，透视感在图片本身里
- 木板左右交替排布（奇偶判断 `isLeft`）
- CSS `rotate(var(--board-rotate))` 给出微小旋转差异
- hover 时 `translateY(-7px)` + 旋转 + scale，模拟"浮起来"
- 文字是 CSS `position: absolute` 定位在木板图上

### 1.4 场景二实现细节

```
星空场景结构：
  <section class="night-scene">
    <div class="night-gradient">             ← 氛围遮罩
    <button class="road-return-zone">        ← 底部小路区域（clip-path三角），点击返回
    <header>标题 + 书签数量</header>
    <div class="planet-field">
      <button class="planet">
        <span class="planet-glow">          ← 径向渐变光晕
        <img class="planet-img" />          ← 星球PNG（12种循环使用）
        <span class="planet-title">         ← 星球下方文字
        <span class="preview-card">         ← hover弹出的详情卡
          favicon + 标题 + 域名 + 来源文件夹
      </button>
    </div>
  </section>
```

星球的"3D感"怎么来的：
- 12 张不同造型的星球 PNG（每个约 20KB），**图片本身画出了球体的立体感和光影**
- `planetSpin` 动画让星球自转（`rotate(360deg)`），增强"球体"错觉
- hover 时 scale(1.14) + 光晕出现 + 自转暂停
- 星球布局用 `planetLayout()` 函数：网格 + 基于种子的抖动算法，生成 (x%, y%) 坐标

星球的布局算法：
```js
function planetLayout(index, total, seedText) {
  // columns = ceil(sqrt(total * 1.65))
  // rows = ceil(total / columns)
  // col = index % columns, row = floor(index / columns)
  // x = 9 + (col+0.5)*82/columns + jitterX    → 百分比定位
  // y = 12 + (row+0.5)*70/rows + jitterY
  // size = baseSize + (seed % 18)              → 随机大小
}
```

### 1.5 转场动画实现（v0.3 版本，项目的核心亮点）

基于用户提供的转场参考视频反复调整，是项目中最复杂的动画部分。

```
时间线（约4.2秒）：

森林 → 星空（to-night）：
  0ms     ─ 森林表面开始下沉/缩放/变暗（forestSurfaceForward）
          ─ 路牌在原地随森林逐渐淡出（signStayInForest）
          ─ 太阳开始下落（sunSetV3）
  约1.8s  ─ 夜空表面开始从中央渐显（nightSceneRevealV3）
          ─ 深色遮罩下压（nightVeilForward）
  约2.0s  ─ 星星逐个弹出（starBornV3，每个有不同delay）
          ─ "大球"从底部滚入（planetRollForwardV3）
  4.2s    ─ 转场完成，DOM替换为夜场景

星空 → 森林（to-forest）：
  反向动画，夜空缩小淡出，森林从远处回弹还原
```

技术手段：
- 全部是 CSS `@keyframes`，定义了约 14 个独立的动画序列
- 用 `cubic-bezier(0.18, 0.72, 0.18, 1)` 缓动函数控制节奏
- 通过在 `transition-layer` 中放置独立的背景层副本 + 星空 span 实现
- 转场期间场景 DOM 保留，`setTimeout` 4.2 秒后才真正切换 `state.scene`

### 1.6 素材清单与体积

| 类别 | 文件 | 大小 | 用途 |
|------|------|------|------|
| 背景 | scene-forest-clean.png | 1.5MB | 场景一全幅森林背景 |
| 背景 | scene-night-clean.png | 1.5MB | 场景二全幅星空露营地背景 |
| 路牌 | sign-pole.png | 245KB | 路牌柱 |
| 路牌 | sign-board-left.png | 110KB | 左朝向木板 |
| 路牌 | sign-board-right.png | 110KB | 右朝向木板 |
| 星球 | planet-01 ~ 12.png | 7-24KB | 12种星球造型 |
| 特效 | leaf-01 ~ 04.png | 7-10KB | 落叶 |
| 特效 | star-01.png / star-small.png | 4-15KB | 星光点 |

**素材总量：约 3.5MB，其中两张背景图占了 3MB。**

### 1.7 数据层

- 与 starry-sky-campsite 几乎相同：`chrome.bookmarks.getTree()` → 遍历树 → 提取文件夹和书签
- Mock 数据支持在普通网页中调试（判断 `chrome.bookmarks` 是否存在）
- 监听 `onCreated/onRemoved/onChanged/onMoved/onChildrenReordered/onImportEnded` 自动刷新
- 使用 `chrome.favicon` 权限获取网站图标
- 书签解析更宽松：`depth > 1` 的子文件夹也会展示（展示二级文件夹的链接，而非只读一级）

---

## 二、两个项目的核心差异对比

### 2.1 技术路线：2D 图片 vs 3D 引擎

| 维度 | my-forest-extension | starry-sky-campsite（我们的方案） |
|------|:---|:---|
| 渲染方式 | 2D DOM + CSS 定位 + PNG 图片叠加 | 3D WebGL（Three.js / R3F）真实 3D 渲染 |
| "深度"来源 | 图片本身画出了透视感 | 3D 引擎根据相机位置真实计算透视 |
| 视角 | 固定视角，不可变 | 相机可任意移动、旋转 |
| 元素关系 | 图片之间是平面叠加（z-index） | 物体在 3D 空间中有真实坐标（x, y, z） |
| 光照 | 画在图片里，静止不变 | 真实光照计算（环境光 + 方向光 + 自发光） |
| 框架 | 无框架，Vanilla JS | React + R3F |
| 构建 | 无构建，直接加载 | Vite 构建 |
| 代码量 | ~440 行 JS | 预计 500-800 行 JSX（拆分多文件） |

### 2.2 动画实现：CSS Keyframes vs useFrame + lerp

| 维度 | my-forest | 我们的方案 |
|------|:---|:---|
| 动画驱动 | CSS `@keyframes` + `transition` | R3F `useFrame` + 逐帧 lerp/插值 |
| 动画类型 | 预定义的固定时间线 | 帧级自由控制，任意变量可驱动 |
| 交互响应 | 只能做 hover/click 的 CSS transition | 可以做任何交互驱动的逐帧动画 |
| 转场动画 | 14 个独立 keyframes，精心编排的时间线 | 可在 useFrame 中自由编排，更灵活但需手写 |
| 物理/弹性 | CSS 自带的 cubic-bezier 缓动 | 需要手写或引入 react-spring/GSAP |
| 性能 | GPU 加速的 CSS 动画，轻量 | Three.js WebGL 渲染，也能到 60fps |
| 调试 | 浏览器 DevTools 直接看 CSS 动画 | 需要在 useFrame 中 console.log 或看 fps 面板 |

### 2.3 画面控制力

| 能力 | my-forest | 我们的方案 |
|------|:---|:---|
| 任意角度观察场景 | ❌ 固定视角 | ✅ 相机自由 |
| 真实透视（远小近大） | ❌ 图片画死 | ✅ 引擎自动 |
| 动态光照改变氛围 | ❌ 光照画在图片里 | ✅ 代码控制灯光参数 |
| 物体自然穿过空间 | ❌ 只有 2D 平面移动 | ✅ 真 3D 移动，自动处理遮挡 |
| 景深/虚化 | ❌ 图片画死 | ✅ 可加 postprocessing |
| 画面风格 | 由图片决定 | 由纹理图 + 材质 + 光照共同决定 |

### 2.4 素材策略

| 维度 | my-forest | 我们的方案 |
|------|:---|:---|
| 素材数量 | ~26 张 PNG | 6 张纹理（设计文档定义） |
| 背景图 | 全幅手绘场景图（1.5MB×2），**画面所有内容都在图里** | 天空球纹理（可选），**画面由 3D 物体组成** |
| 星球/星星 | 12 张不同造型的星球 PNG | 球体几何体 + 发光材质，代码参数调大小/颜色 |
| 路牌 | 3 张 PNG（柱子 + 左板 + 右板） | 圆柱体 + 方块几何体 + 木纹纹理 |
| 文字 | HTML span 定位在图片上 | CanvasTexture 动态绘制后贴到 3D 面上 |
| 素材总体积 | ~3.5MB | ~500KB-1MB（纹理图更小更少） |

### 2.5 关键差异总结

```
my-forest：画面 = 图片叠图片
           → 图片画得好看 = 画面好看
           → 但画面被图片固定死了

我们的方案：画面 = 3D场景 = 几何体 × 纹理 × 光照 × 相机
           → 每个维度都可独立控制
           → 画面是"搭建"出来的，不是"画死"的
           → 代价是需要同时控制多个维度
```

---

## 三、my-forest 方案中值得我们参考的地方

### 3.1 转场动画的编排思维

my-forest 的转场是逐帧精心编排的：
- 森林表面不是瞬间消失，而是**下沉 → 缩放 → 变暗**三个阶段
- 夜空不是瞬间出现，而是**从中央稍大尺寸逐渐缩放到正常**
- 星星有**错落的弹出延迟**，营造"逐渐亮起"的感觉
- 有一个"大球"从画面底部滚入，填充转场中段的视觉空洞
- 太阳下落和夜空暗幕同步推进

我们做相机过渡动画时，可以拆解为：
1. 相机开始后撤 + 仰头
2. 路牌场景逐渐变暗 + 缩小
3. 天空场景从暗变亮
4. 星星逐个浮现（延迟错开）
5. 相机到达目标位置

### 3.2 素材制作思路：全幅手绘图 vs 分体纹理

my-forest 用了"全幅手绘场景背景图"的策略——场景一的森林、小路、天空、光影，**全画在一张图里**。这样做的好处：
- 不需要调灯光、不需要管景深、不需要操心透视——画师已经在图里画好了
- 画面的"精美度"完全由画师水平决定，和代码无关

我们的方案是把场景拆成独立元素，优势是灵活，代价是需要同时控制多个变量。一个折中思路：
- **部分元素用全幅图**：比如天空球可以用一张画好的天空图（含云、星星、色彩层次）
- **部分元素用 3D 几何体**：路牌、星星（需要交互的元素）

### 3.3 CSS 动画作为补充手段

my-forest 的落叶、星光闪烁等"环境氛围动画"用 CSS keyframes 非常高效。我们可以在 HTML Overlay 层用 CSS 动画做一些粒子效果（萤火虫、飘浮光点、尘埃），不需要所有东西都进 3D 场景。

### 3.4 种子化随机布局

my-forest 用 `seededNumber()` 基于文件夹 ID 生成确定性的随机位置，这样**每次渲染同一个文件夹的星球位置不变**。我们的星星布局也应该这样做——基于书签 ID 做种子随机，保证每次打开排列一致。

### 3.5 减少运动选项

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
  }
}
```

我们的 `useFrame` 动画也应该检查 `prefers-reduced-motion`，无障碍设计考虑。

---

## 四、两方案各自适合什么场景

### 选 my-forest 方案（2D CSS + 图片素材）如果：

- 你有一张非常精美的全幅场景图，不想拆开
- 不需要用户自由旋转/移动视角
- 交互比较简单（点击、hover）
- 想快速出成品，不想学 Three.js
- 对"3D 空间的真实感"没有执念

### 选我们的方案（Three.js + R3F）如果：

- 你想要**真实 3D 透视**（物体走远会自动变小，不需要手动算）
- 你想要**相机可以移动**（做飞行过渡、视角切换）
- 你未来想做**小猫沿路行走**的动画（真的在 Z 轴上移动，自动透视缩小）
- 你想要动态光照（场景一温暖 vs 场景二清冷，一个参数切换）
- 你想要**更好的扩展性**（加粒子效果、景深、后处理）

---

## 五、结论

两个项目解决同一个问题（书签可视化新标签页），用了两条完全不同的技术路径：

| | my-forest | starry-sky-campsite |
|:---|:---|:---|
| 路径 | 把画面"画"出来 | 把画面"搭"出来 |
| 核心技能 | 画图 + CSS | 3D 编排 + 材质调整 |
| 精美度来源 | 图片画工 | 纹理 + 光照 + 构图 |
| 灵活性 | 低（画面固定） | 高（每个维度独立可控） |
| 适合 | 展示型、浏览型场景 | 探索型、沉浸型场景 |

**我们的方案在动画灵活性上更强，但需要你同时掌控多个维度（纹理、光照、相机、材质参数）。my-forest 的方案在视觉精美度上更依赖图片质量，但实现更简单粗暴。**

你的项目要实现的"小猫沿路走 → 场景转换 → 仰望星空"这个叙事流程，Three.js 是天然适合的——因为角色需要真的在 3D 空间中移动，透视由引擎自动计算。用 my-forest 的方案做这个小猫动画会非常痛苦（你要手动计算每帧的缩放来模拟透视）。
