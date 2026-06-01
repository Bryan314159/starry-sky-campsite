# 收藏夹可视化 — 设计文档

## 一、架构总览

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

- **产品形态**：Chrome 扩展 Manifest V3，替代新标签页
- **类型**：纯前端项目，无后端、无服务器、无数据库
- **数据来源**：浏览器本地书签（Chrome Bookmarks API）
- **搜索**：调用 Chrome Search API 触发默认搜索引擎

---

## 二、技术栈

| 层面 | 选择 | 版本 | 理由 |
|------|------|------|------|
| 框架 | React | 19.x | 组件化状态管理，R3F 依赖 |
| 3D 渲染 | Three.js + React Three Fiber | three@latest, @react-three/fiber | 真 3D 空间表现透视和星空，R3F 做声明式封装 |
| 构建 | Vite | 6.x | 构建快，`@crxjs/vite-plugin` 一键打包扩展 |
| 扩展标准 | Manifest V3 | — | Chrome 当前强制标准 |
| 语言 | JavaScript (JSX) | ES2022+ | 无类型约束，快速开发 |

### 额外依赖

| 包 | 用途 |
|------|------|
| `@react-three/drei` | R3F 工具集（天空球、文字、射线检测等便捷封装） |
| `@react-three/postprocessing` | 后续阶段加轮廓线、色彩分级等后期效果 |
| 无状态管理库 | React Context + useReducer 足够 |

---

## 三、项目文件结构

```
starry-sky-campsite/
├── manifest.json                # Chrome 扩展清单
├── newtab.html                  # 新标签页入口 HTML
├── vite.config.js               # Vite + crxjs 配置
├── package.json
│
├── public/
│   └── textures/                # 手绘纹理静态资源
│       ├── grass.png            #   草地
│       ├── wood.png             #   木头
│       ├── sky-day.png          #   场景一白天天空
│       ├── sky-night.png        #   场景二夜空
│       ├── signboard-blank.png  #   路牌空白板
│       └── star.png             #   星星精灵
│
└── src/
    ├── main.jsx                 # React 入口，挂载 <App/>
    │
    ├── App.jsx                  # 顶层：Context Provider + R3F Canvas + HTML Overlay
    │
    ├── context/
    │   └── AppContext.jsx       # 场景状态、选中文件夹、书签数据
    │
    ├── hooks/
    │   ├── useBookmarks.js      # 封装 chrome.bookmarks API 调用
    │   └── useRaycast.js        # 射线检测点击/悬停逻辑
    │
    ├── scenes/
    │   ├── Campsite.jsx         # 场景一：营地路牌（组合组件）
    │   │
    │   └── StarrySky.jsx        # 场景二：星空书签（组合组件）
    │
    ├── components/
    │   ├── Ground.jsx           # 草地地面（两场景复用）
    │   ├── Path.jsx             # 小路（两场景复用）
    │   ├── SkyDome.jsx          # 天空球（参数化：白天/夜晚）
    │   ├── Signpost.jsx         # 路牌柱 + 动态生成指示牌
    │   ├── SignBoard.jsx        # 单块指示牌（3D 板 + CanvasTexture 文字）
    │   ├── StarField.jsx        # 星空系统（管理多颗星星）
    │   ├── Star.jsx             # 单颗星星
    │   └── Cat.jsx              # 小猫（占位，等设计稿）
    │
    ├── overlays/
    │   ├── SearchBar.jsx        # 搜索框（HTML 叠加层）
    │   └── Tooltip.jsx          # 星星 hover 提示（HTML 叠加层）
    │
    └── utils/
        └── bookmarks.js         # 书签树解析函数
```

---

## 四、组件树

```
<App>
├── <AppProvider>                    ← Context: scene, selectedFolder, bookmarks
│   │
│   ├── <Canvas>                     ← R3F 3D 画布
│   │   ├── {scene === 'campsite' &&
│   │   │   <Campsite>
│   │   │     <SkyDome variant="day" />
│   │   │     <Ground />
│   │   │     <Path />
│   │   │     <Signpost>
│   │   │       {folders.map(f =>
│   │   │         <SignBoard key={f.id} folderName={f.name} />
│   │   │       )}
│   │   │     </Signpost>
│   │   │   </Campsite>
│   │   │ }
│   │   │
│   │   │ {scene === 'starry' &&
│   │   │   <StarrySky>
│   │   │     <SkyDome variant="night" />
│   │   │     <StarField>
│   │   │       {selectedFolder.children.map(b =>
│   │   │         <Star key={b.id} title={b.title} url={b.url} />
│   │   │       )}
│   │   │     </StarField>
│   │   │     <Ground />
│   │   │     <Path returnTrigger />
│   │   │     <Cat />
│   │   │   </StarrySky>
│   │   │ }
│   │   └──
│   │
│   ├── <SearchBar />               ← HTML 叠加层，始终显示
│   └── <Tooltip />                  ← HTML 叠加层，hover 星星时显示
```

---

## 五、数据层设计

### 5.1 书签读取流程

```
chrome.bookmarks.getTree()
        │
        ▼
utils/bookmarks.js  parseBookmarkTree()
        │
        │  1. 定位 "书签栏" 节点 (parentId === '1' 的 toolbar 子节点)
        │  2. 遍历其直接子节点
        │  3. 仅保留类型为 folder 且有 children 的节点
        │  4. 忽略"其他书签"节点
        │  5. 忽略嵌套子文件夹内的深层书签
        │  6. 忽略空文件夹
        │
        ▼
[
  {
    id: "123",
    name: "开发工具",
    children: [
      { id: "456", title: "GitHub", url: "https://github.com" },
      { id: "789", title: "Stack Overflow", url: "https://stackoverflow.com" },
      ...
    ]
  },
  { ... },
  ...
]
```

### 5.2 AppContext 状态

```js
{
  scene: 'campsite' | 'starry',      // 当前场景
  folders: [],                        // 解析后的一级文件夹数组
  selectedFolder: null,              // 当前选中的文件夹（含 children）
  bookmarksLoaded: false,             // 书签是否已加载
  hasBookmarks: true,                 // 是否有有效书签
}
```

### 5.3 数据流转

```
useBookmarks()                     ← 调用 chrome.bookmarks.getTree()
    │
    ▼
parseBookmarkTree(rawTree)         ← utils/bookmarks.js
    │
    ▼
AppContext ── folders[] ──────────▶ Scene 1 渲染路牌
    │
    │  用户点击路牌
    ▼
AppContext ── selectedFolder ─────▶ Scene 2 渲染星星
    │
    │  用户点击星星
    ▼
window.location.href = star.url   ← 在当前标签页打开网址
```

---

## 六、场景实现设计

### 6.1 场景一：营地·路牌

#### 摄像机

```js
camera.position.set(3, 1.6, 4.5)   // 右前方，略高于地面
camera.lookAt(0, 1.3, -1)           // 注视路牌柱中心
// FOV: 60°, near: 0.1, far: 50
```

#### 元素几何体与材质

| 元素 | 几何体 | 材质 | 纹理 |
|------|--------|------|------|
| 地面 | `PlaneGeometry(12, 20)` 平铺于 XZ | `MeshToonMaterial` | `grass.png` |
| 小路 | `PlaneGeometry(1.5, 15)` 沿 Z 轴从近到远 | `MeshToonMaterial` | 泥土/小径纹理 |
| 天空 | `SphereGeometry(20, 32, 32)` 包裹全场 | `MeshBasicMaterial` (无光照) | `sky-day.png` |
| 路牌柱 | `CylinderGeometry(0.12, 0.15, 3.5)` | `MeshToonMaterial` | `wood.png` |
| 指示牌 | `BoxGeometry(0.8, 0.22, 0.04)` | `MeshToonMaterial` | `signboard-blank.png` + CanvasTexture 文字 |

#### 路牌布局

```
路牌柱坐标: (0, 1.75, 0)   ← 柱中心（柱高 3.5，底部在 y=0）

指示牌在柱上的排列（共 N 块，N = folders.length）：
  每块牌:
    position.y  = 0.6 + i * 0.45     ← 从低到高均匀分布
    rotation.y  = -0.6 + i * 0.25    ← 每块指向稍有不同
    position.x  = 0（附着在柱上）

文字通过 CanvasTexture 动态绘制：
  1. 创建离屏 Canvas
  2. 绘制手绘风格底色
  3. 绘制文件夹名称文字
  4. 导出为 CanvasTexture
  5. 赋给指示牌的 MeshToonMaterial.map
```

#### 光照

```js
<ambientLight intensity={0.4} />
<directionalLight position={[5, 8, 3]} intensity={1.2} color="#FFE4B5" />
<hemisphereLight args={["#87CEEB", "#4B7B3D", 0.3]} />
```

#### 空状态

无书签时，在路牌柱上生成 2-3 块预置指示牌，显示引导文案：
- "在这里添加你的第一个书签"
- "在书签栏创建文件夹来组织链接"
- "然后回到这里，探索你的星空"

### 6.2 场景二：星空·书签

#### 摄像机

```js
camera.position.set(0, 0.2, 0)      // 接近地面，小猫视角
// 相机向上仰视
camera.rotation.x = -Math.PI * 0.35 // 仰角约 63°
// FOV: 70°, near: 0.1, far: 50
```

#### 元素几何体与材质

| 元素 | 几何体 | 材质 | 纹理 |
|------|--------|------|------|
| 天空穹顶 | `SphereGeometry(18, 48, 48)` 内表面 | `MeshBasicMaterial`, `side: BackSide` | `sky-night.png` |
| 星星 | `SphereGeometry(0.06–0.20, 8, 8)` | `MeshStandardMaterial` + emissive | 无纹理，用 emissive 发光 |
| 地面 | 复用 `Ground`，仅底部可见 | 同场景一 | `grass.png` |
| 小路 | 复用 `Path`，位于底部 | 同场景一 | — |
| 小猫 | 待设计稿，先用简单几何体占位 | `MeshToonMaterial` | — |

#### 星星布局

```
星星分布在天空穹顶的上半部分（仰角 15° 以上区域）：

生成算法（每颗星）：
  azimuth   = Math.random() * Math.PI * 2          // 水平角 0-360°
  elevation = Math.random() * Math.PI * 0.4 + 0.3  // 仰角 ~17°-90°
  radius    = 16 + Math.random() * 2               // 距离球心
  size      = 0.06 + Math.random() * 0.14          // 随机大小

笛卡尔坐标：
  x = radius * cos(elevation) * sin(azimuth)
  y = radius * sin(elevation)
  z = radius * cos(elevation) * cos(azimuth)
```

#### 光照

```js
<ambientLight intensity={0.15} />
// 星星自身发光，不依赖外部光源
```

#### 返回触发

小路的可点击区域使用 Three.js Raycaster 检测：
- 射线命中 `Path` 网格 → 触发场景切换回场景一
- 当前场景直接用 `scene` 状态切换，无动画

### 6.3 场景切换

MVP 采用**直接切换**（无过渡动画）：

```js
// 场景一 → 场景二
onSignBoardClick(folder) {
  setSelectedFolder(folder);
  setScene('starry');
}

// 场景二 → 场景一
onPathClick() {
  setScene('campsite');
}
```

后续迭代加入相机过渡动画（R3F `useFrame` 或 GSAP）。

---

## 七、交互设计

### 7.1 点击检测

使用 Three.js Raycaster：

```
鼠标点击 → 屏幕坐标 → Raycaster.setFromCamera()
  → scene.children 射线相交检测
  → 命中 SignBoard → 场景切换
  → 命中 Star     → 打开 URL
  → 命中 Path      → 返回场景一
```

R3F 中通过 `<mesh onClick={...} />` 声明式绑定。

### 7.2 Hover 效果

```
onPointerOver(star) →
  1. star.scale = 1.3x
  2. star.emissiveIntensity 提升
  3. 显示 HTML Tooltip（网站名）

onPointerOut(star) →
  1. star.scale 还原
  2. star.emissiveIntensity 还原
  3. 隐藏 Tooltip
```

Tooltip 定位：获取屏幕坐标 → 在星星位置上方偏移显示 HTML 元素。

### 7.3 搜索框

```
┌──────────────────────────────────────┐
│                                      │
│         [ 场景画面区域 ]              │
│                                      │
│         ┌──────────────────┐         │
│         │ 🔍 搜索...      │ ← 底部居中，半透明，圆角
│         └──────────────────┘         │
│                                      │
└──────────────────────────────────────┘
```

- HTML `<input>` 通过绝对定位叠在 Canvas 上
- 样式：半透明背景、手绘风边框、融入画面底部
- 回车 → `chrome.search.query({ text: inputValue })` 触发默认搜索
- 始终可见，不随场景切换隐藏

---

## 八、资产规格

### 8.1 纹理清单

| 纹理 | 尺寸 | 格式 | 说明 |
|------|------|------|------|
| grass.png | 512×512 | PNG | 手绘草地质感，可平铺 |
| wood.png | 256×512 | PNG | 手绘木质纹理 |
| sky-day.png | 2048×1024 | PNG | 暖色调傍晚天空，EQUIRECTANGULAR |
| sky-night.png | 2048×1024 | PNG | 深蓝紫渐变的夜空，EQUIRECTANGULAR |
| signboard-blank.png | 512×128 | PNG | 手绘木质路牌底板 |
| star.png | 64×64 | PNG | 手绘星星/光点精灵（可选） |

### 8.2 字体

- 指示牌文字：使用 Canvas 2D API 绘制，字体选择清晰可读的无衬线体
- 搜索框：继承浏览器默认字体

### 8.3 小猫

- 待设计图
- MVP 阶段可用简单几何体（Sphere + Box）组合占位
- 场景二中面向观众（正面），位于画面底部中央

---

## 九、Chrome 扩展配置

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "收藏夹可视化 - 星空营地",
  "version": "0.1.0",
  "description": "将书签变成从营地走向星空的沉浸式旅程",
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "permissions": ["bookmarks", "search"],
  "host_permissions": [],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## 十、开发里程碑

### Phase 1：项目骨架

- [ ] Vite + React + R3F 项目初始化
- [ ] `@crxjs/vite-plugin` 扩展打包配置
- [ ] `manifest.json` 创建
- [ ] `newtab.html` 入口
- [ ] Chrome 中加载未打包扩展，确认新标签页正常替换

### Phase 2：数据层

- [ ] `utils/bookmarks.js` 解析函数
- [ ] `useBookmarks` hook
- [ ] `AppContext` 状态管理
- [ ] 空状态 mock 数据（开发时无真书签也可渲染）

### Phase 3：场景一

- [ ] `Ground` + `Path` + `SkyDome(day)` 基础场景
- [ ] `Signpost` + `SignBoard` + CanvasTexture 文字
- [ ] 光照调试
- [ ] 点击路牌切换场景

### Phase 4：场景二

- [ ] `SkyDome(night)` + `StarField` + `Star`
- [ ] 点击星星打开 URL
- [ ] Hover 星星显示 Tooltip
- [ ] 点击小路返回场景一

### Phase 5：搜索与交互完善

- [ ] `SearchBar` HTML 叠加层 + `chrome.search.query`
- [ ] 交互细节打磨（cursor pointer、hover 过渡）
- [ ] 空状态测试

### Phase 6：视觉打磨

- [ ] 手绘纹理导入替换临时材质
- [ ] 色调、光照、氛围调优
- [ ] 小猫占位模型
- [ ] 加载性能优化（纹理压缩、按需加载）

---

## 十一、注意事项

1. **新标签页限制**：Chrome 新标签页无法使用 `window.open`，MV3 中某些 API（如 `chrome.tabs`）需要额外权限。打开书签使用 `window.location.href` 直接在当前标签页跳转即可。

2. **开发调试**：Chrome 新标签页扩展开发时，每次修改需要手动在 `chrome://extensions` 刷新扩展，或使用 Vite HMR（`@crxjs/vite-plugin` 支持热更新）。

3. **性能目标**：新标签页打开速度是关键。首帧渲染目标 < 500ms。避免大纹理，使用 `MeshToonMaterial` 减少 shader 复杂度。

4. **书签数据为空**：必须优雅处理无书签、无文件夹、空文件夹三种情况。

5. **纹理风格统一**：所有手绘纹理需要保持一致的笔触和色调风格，否则画面会显得割裂。
