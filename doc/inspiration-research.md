# 灵感与技术研究 — 星空营地的同类项目调研

> **目的**：在完成场景一画面升级（任务 2.11 / 2.12）后，调研其他人在"new-tab 扩展 / 书签可视化 / 手绘 3D 场景"三个维度的实现方式，提取可借鉴的范式与技法。
> **生成日期**：2026-06-05
> **关联文档**：`doc/art-style.md`、`doc/scene-design.md`、`doc/demand.md`
> **方法**：3 个 Explore 代理并行调研；本文件为综合整理，原报告见 `~/.claude/plans/async-sprouting-ritchie-agent-*.md`

---

## 一、调研维度

| 维度 | 核心问题 |
|------|---------|
| **A. 艺术化 / 3D new-tab 扩展** | 别人怎么把 new-tab 做成有"场景感"的？用了什么渲染技法？ |
| **B. 书签 / 收藏夹可视化项目** | 别人怎么把书签树 → 视觉？数据驱动的范式是什么？ |
| **C. Three.js / R3F 手绘 / 插画风技法** | 怎么用 Three.js 做出"动画 / 插画"而不是"3D 写实"的效果？ |

---

## 二、维度 A — 艺术化 / 3D new-tab 扩展（精选）

### 1. Tabliss
- **URL**：https://github.com/joelshepherd/tabliss
- **说明**：开源 new-tab 扩展。背景可换图、加 widget、显示时间/天气/搜索。
- **技法**：插件式架构 + CSS Grid + 各种背景模块（图片、Unsplash、色块）。
- **借鉴**：插件化思路——可考虑把"猫角色 / 天气 / 番茄钟"做成可选 widget。
- **局限**：纯 2D，背景是平铺图，没有 3D 场景感。

### 2. Momentum
- **URL**：https://momentumdash.com
- **说明**：商业 new-tab。每次打开换一张风景照 + 当日一句引言 + 待办 + 时钟。
- **技法**：照片级风景 + 排版。整套产品语言是"每天打开新 tab 是一次小确幸"。
- **借鉴**：每次打开的"仪式感"——这与我们的"治愈系"高度一致。引言功能可考虑。
- **局限**：商业闭源，技术细节不可见；2D 静态。

### 3. Bonjourr（开源 Momentum 替代）
- **URL**：https://github.com/bonjourr/bonjourr
- **说明**：模仿 Momentum 风格的开源扩展，Apple 风排版、字体驱动。
- **技法**：纯前端 + localStorage。字体（Inter / Fraunces）+ 配色 token。
- **借鉴**：排版与字体的克制（不堆砌），是"治愈"最直接的视觉语言。
- **局限**：依然 2D 静态。

### 4. Bruno Simon 个人站
- **URL**：https://bruno-simon.com
- **说明**：Three.js 经典案例。一个 3D 驾驶场景可以开车探索。
- **技法**：Three.js + cannon-es 物理 + GLTF 模型 + Bloom 后处理 + 卡通风格化贴图。
- **借鉴**：交互的"可探索性"——我们的营地未来可以加入 WASD 漫步。
- **局限**：风格偏工业 3D，与"治愈系"相反。

### 5. Active Theory / Resn.co / Lusion 等 3D 沉浸式站点
- **URL**：https://activetheory.net / https://resn.co.nz / https://lusion.co
- **说明**：数字代理 / 设计公司用 Three.js 做的全屏沉浸式站点。
- **技法**：自定义 GLSL 着色器 + PostProcessing 链 + WebGL 优化 + 滚动驱动相机动画。
- **借鉴**：滚动驱动相机（scroll-driven camera）——可以加在场景切换时。
- **局限**：技术栈偏重，扩展里首帧要 < 500ms，需要权衡。

### 6. Awwwards "Sites of the Day"（按 Three.js 筛选）
- **URL**：https://www.awwwards.com/websites/three-js/
- **说明**：每日的优秀 3D 网站集合。
- **借鉴**：作为灵感的日常补给站。

---

## 三、维度 B — 书签 / 收藏夹可视化（重点）

### 1. Are.na  ⭐ 最强治愈系参考
- **URL**：https://www.are.na · https://www.are.na/about
- **说明**：2014 年至今的反算法创意研究平台。"channels = 收藏夹，blocks = 内容（链接 / 图 / 文本 / PDF / 视频）"。
- **范式**：无算法、无点赞、无信息流；可拖拽、可评论、可协作。
- **关键文案**："playlists for ideas" / "rabbit holes" / "build your own memory palace"。
- **借鉴**：
  - **文案语言**：直接借用 "memory palace"（与"星空营地"天然契合）。
  - **反算法立场**：星空不是按"点击量"排名的，是平等的——与"治愈系"对齐。
  - **协作可选**：未来可考虑 signpost 之间的"分享路径"。
- **参考程度**：⭐⭐⭐⭐⭐

### 2. nightTab  ⭐ 氛围最像
- **URL**：https://addons.mozilla.org/en-US/firefox/addon/nighttab/
- **说明**：深色、单页、可高度自定义字体 / 强调色 / 背景；书签分组显示。
- **范式**：分组即章节（chapter），不弹窗、不打断。
- **借鉴**：
  - **字体 + 颜色驱动**：Indie 营地也该有这种"打开就心静"的字体体验。
  - **没有 streak / 没有 recency highlight**：避免"成就系统"的反治愈。
- **参考程度**：⭐⭐⭐⭐⭐

### 3. Homer
- **URL**：https://github.com/bastienwirtz/homer
- **说明**：自托管 dashboard，YAML 配置服务/链接，搜索即焦点。
- **范式**："声明式"配置 + 卡片网格。`/` 触发搜索。
- **借鉴**：Homer 是声明式，我们已经是**自动式**（读真实书签树）——保持这种 calm 感比"硬塞 tile"重要。
- **参考程度**：⭐⭐⭐

### 4. Heimdall
- **URL**：https://github.com/linuxserver/Heimdall
- **说明**：应用 dashboard，tile 显示 app 图标 + 颜色，可拖拽重排。
- **范式**："图标 + 颜色 = 识别"，颜色由 app metadata 推导。
- **借鉴**：
  - 星空里的"star 颜色 / 大小 = favicon 色相 + 访问频次"（**注意：需要权衡"治愈系"是否要求"平等"**）。
  - 拖拽重排 = 路径重排——可作为未来功能。
- **参考程度**：⭐⭐⭐

### 5. Raindrop.io
- **URL**：https://raindrop.io
- **说明**：商业书签管理。多视图：grid / headlines / masonry / list；支持 full-text 搜索、tag、web archive 副本。
- **范式**："同一棵书签树，可被渲染成不同视图"——**关键洞察**：数据不变，变的只是"场景"。
- **借鉴**：
  - **强证**：把原生书签树渲染成 3D 营地，不会丢失信息（用户还能从熟悉的逻辑里读出来）。
  - 未来可考虑 "masonry 视图 / 3D 营地视图" 切换。
- **参考程度**：⭐⭐⭐⭐

### 6. Pocket
- **URL**：https://en.wikipedia.org/wiki/Pocket_(service)
- **说明**：read-later 工具，stripped-down reader mode。
- **范式**：保存 → 阅读，之间没有"花哨预览"。
- **借鉴**：
  - **hover 星星的 tooltip = 标题 + favicon + 首段**，"克制地揭示"而非"弹窗轰炸"。
- **参考程度**：⭐⭐⭐

### 7. Bookmarks Map
- **URL**：https://github.com/tautcony/BookmarksMap
- **说明**：把书签按地理编码 pin 到世界地图。folder = 颜色聚类。
- **范式**：书签 → 地理坐标（2D）。
- **借鉴**：
  - 我们的"signpost 一行" ≈ Bookmarks Map 压成 1D；星空 ≈ Bookmarks Map 升到 3D。
  - **drill-down 习惯**：用户已经会这种"点开更细"的导航。
- **参考程度**：⭐⭐⭐⭐

### 8. TimeMap / SIMILE
- **URL**：https://github.com/simile-widgets/timemap
- **说明**：地图 + 时间线同步 brush 过滤。
- **范式**：任何带 `(time, lat, lng)` 的数据 → 双轴可视化。
- **借鉴**：
  - 3D 场景里 height = 访问频次 / x = time / y = category——可作为星空里的"层"参考。
- **参考程度**：⭐⭐

### 9. HistoryMap / Map of Reddit / Map of Wikipedia
- **URL**：https://historymap.info 等
- **说明**：力导向图 / 地理图，节点是内容、边是关系。
- **范式**：content-as-node，folder-as-cluster，relationship-as-edge。
- **借鉴**：
  - **星空 ≈ 力导向图在 3D 里的隐喻**——folder 边界由 hierarchy 天然给出来，不需要物理模拟。
- **参考程度**：⭐⭐⭐

### 10. Lost at Night  ⭐ 视觉最像
- **URL**：https://www.lostateminor.org
- **说明**：把"夜间卫星看地球"的真实小行星观测数据 → 3D 星空 globe。
- **范式**：真实数据 → 星空 3D，orbit + zoom + click。
- **借鉴**：
  - **深蓝紫 + 轻微 bloom + 慢相机阻尼**——直接是"星空营地"场景二的色彩 / 动态参考。
  - 不需要写实，但需要"克制真实感"——和我们 toon 化方向一致。
- **参考程度**：⭐⭐⭐⭐⭐

### 11. Session Buddy
- **URL**：https://chromewebstore.google.com/detail/session-buddy-tab-bookma/edacconmaakjimmfjnbloccmbclgghlo
- **说明**：new-tab dashboard + tab session 管理。
- **范式**：用户已经"按组思维"——星空营地不必教新模型。
- **借鉴**：心智模型对齐。
- **参考程度**：⭐⭐

### 12. Flame startpage
- **URL**：https://flame.labnotes.org
- **说明**：自托管、YAML 配置、深色、键盘友好。
- **借鉴**：Homer / nightTab 之外的"安静派 dashboard"集群。
- **参考程度**：⭐⭐

---

## 四、维度 C — Three.js / R3F 手绘 / 插画风技法（重点）

### 1. `MeshToonMaterial` + `gradientMap` + `NearestFilter`（地基）
- **URL**：https://threejs.org/docs/#api/en/materials/MeshToonMaterial
- **现状**：项目已在用 `meshToonMaterial`，但没显式提供 gradientMap。
- **技法**：
  ```js
  const grad = new THREE.DataTexture(
    new Uint8Array([40, 130, 210, 255]), 4, 1, THREE.RedFormat
  );
  grad.minFilter = grad.magFilter = THREE.NearestFilter;
  grad.needsUpdate = true;
  const mat = new THREE.MeshToonMaterial({
    color: 0x7a9f5a,
    gradientMap: grad,
  });
  ```
- **为什么关键**：4 阶 → 2-3 阶的色阶感是"插画"和"渲染"的分水岭；`NearestFilter` 让色阶过渡"硬切"而非"渐变"。

### 2. drei `<Outlines screenspace>`（描边，必备）
- **URL**：https://github.com/pmndrs/drei#outlines
- **现状**：项目目前用 wobble 边框 + 钉头细节模拟描边。
- **技法**：
  ```jsx
  import { Outlines } from '@react-three/drei';
  <mesh>
    <torusKnotGeometry />
    <meshToonMaterial color="orange" />
    <Outlines thickness={0.06} color="#1f1a14" screenspace />
  </mesh>
  ```
- **优势**：
  - 描边粗细**屏幕空间恒定**（不随距离衰减）——动画感的关键。
  - 前景粗（4-6px）、背景细（1-2px）可控。
- **落地位置**：Signpost、Campfire、ForegroundFlowers、SignpostBird、Tree 剪影。

### 3. three.js `OutlinePass`（全局背景描边，可选）
- **URL**：https://threejs.org/examples/?q=outline
- **说明**：post-process 全局描边，用 depth+normal buffer 算边。
- **优势**：不需要 inverted hull，省 draw call。
- **代价**：整套 scene 都画一遍，复杂场景偏贵。
- **落地位置**：可以包整个 Campsite 场景根节点，做"全局 ink line"。

### 4. 颜色量化后处理（Bayer dither）—— 单 knob 大升级
- **说明**：整屏每个通道 `floor(c * N) / N`，加 Bayer 抖动避免 banding。
- **为什么关键**：从"3D 渲染"变"插画 3D"的**最便宜**方法。3-4 阶就够。
- **代码片段**（@react-three/postprocessing 自定义 effect）：
  ```glsl
  uniform sampler2D tDiffuse;
  uniform float uLevels;  // 4
  uniform vec2  uResolution;
  varying vec2 vUv;

  float bayer4(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int idx = x + y * 4;
    float b[16] = float[16](
       0., 8., 2.,10., 12., 4.,14., 6.,
       3.,11., 1., 9., 15., 7.,13., 5.
    );
    return b[idx] / 16.0 - 0.5;
  }
  void main() {
    vec3 c = texture2D(tDiffuse, vUv).rgb;
    c += bayer4(gl_FragCoord.xy) / uLevels;
    c = floor(c * uLevels) / uLevels;
    gl_FragColor = vec4(c, 1.0);
  }
  ```
- **代价**：一个 fullscreen pass，几乎免费。

### 5. canvas 纹理统一 `NearestFilter`（小改动大收益）
- **现状**：项目里大量 canvas-painted 纹理（草地 / 雾带 / 木纹 / 灼痕 / 鸟）默认是 linear filter。
- **问题**：linear 把 wobble / 笔触都"磨平"了，看着像 noise。
- **解决**：把所有 canvas 纹理设 `magFilter = NearestFilter`——wobble 立刻像"刻意的笔触"。
- **成本**：一行属性。

### 6. 域扭曲 fBm 着色器（水彩天空/雾）
- **URL**：https://iquilezles.org/articles/warp/
- **说明**：Iquilezles 域扭曲——采样 `fbm(p)` 当 UV 偏移，再 `fbm(p + offset)`，得到有机色块边界。
- **代码片段**：
  ```glsl
  float fbm(vec2 p) { /* standard 5-octave fbm */ }

  vec2 q = vec2(fbm(p + uTime*0.05), fbm(p + vec2(1.7, 9.2)));
  vec2 r = vec2(fbm(p + 4.0*q + vec2(8.3, 2.8)),
                fbm(p + 4.0*q + vec2(1.7, 9.2)));
  float wash = fbm(p + 4.0*r);
  wash = floor(wash * 3.0) / 3.0;  // 量化 3 阶
  vec3 col = mix(warmInk, warmPaper, wash);
  ```
- **落地**：替换 SkyDome 现有的 `noise(vWorldPos.xz * 0.08)` 着色器；扩展到雾带、远山。

### 7. CSS 缩放 0.5× DPR 渲染（整画面柔化）
- **说明**：把 `<Canvas>` 渲染成 0.5× devicePixelRatio，CSS 放大到全屏。
- **效果**：自带模糊的"插画感"，很多 new-tab 扩展都用。
- **代价**：文字略糊，禁用。
- **落地**：可以做一个开关，"插画柔化模式"。

### 8. 远景 billboard 树木 impostor
- **说明**：超过 ~20m 的树用画好的一张 canvas 卡片代替。
- **优势**：大量"画上去的树"——罗小黑森林必杀。
- **落地**：替换 BackgroundLayers 的树丛。

### 9. Octopath HD-2D 整体管线参考
- **URL**：https://en.wikipedia.org/wiki/Octopath_Traveler
- **说明**：3D 场景 + 2D 预渲染像素精灵 + 2 阶 toon + 暖 LUT + 浅景深。
- **借鉴**：作为"长期目标"的视觉范式参考——3D 场景 + 2D 元素混合。

### 10. Inverted-hull 自定义 ShaderMaterial
- **3 行代码**：vertex 里 `position += normal * thickness`，然后 `side: BackSide, color: black`。
- **优势**：比 drei `<Outlines>` 还便宜；缺点：要自己写 material。
- **落地**：用于角色（Cat 未来上线时）。

---

## 五、综合 — 对"星空营地"项目的可借鉴清单

### 1. 同类项目范式借鉴（落到产品 / 文案 / 心智）

| 我们的元素 | 借鉴自 | 具体可做 |
|----------|-------|---------|
| Signpost 行 | Homer / Heimdall / nightTab | 借鉴 nightTab 的"安静 + 字体驱动"克制感 |
| 星空 = 书签 | Lost at Night | 直接复用其深蓝紫 + 慢阻尼相机 + 轻微 bloom 配方 |
| Folder → 切换 | Are.na "channel drill-down" | 文案用 "step into the woods" / "this folder, tonight's sky" |
| Hover tooltip | Pocket reader-mode | "克制揭示"：favicon + 标题 + 第一段，不弹窗 |
| 整体哲学 | Are.na / Homer / nightTab | 反算法、不排名、不上 streaks |

### 2. 技法借鉴（按 ROI 排序）

| # | 技法 | 工具 | 难度 | 视觉收益 | 推荐度 |
|---|------|------|:---:|:---:|:---:|
| 1 | canvas 纹理改用 `NearestFilter` | three.js 内置 | 🟢 极低 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2 | drei `<Outlines screenspace>` | drei | 🟢 低 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 3 | `MeshToonMaterial` + 3 阶 `gradientMap` + `NearestFilter` | three.js | 🟢 低 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 4 | 颜色量化后处理（Bayer dither） | 自定义 ShaderPass | 🟡 中 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 5 | SkyDome 域扭曲 fBm 着色器 | 自定义 ShaderMaterial | 🟡 中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 6 | 远景 billboard 树木 impostor | 自定义卡片 | 🟡 中 | ⭐⭐⭐ | ⭐⭐⭐ |
| 7 | CSS 0.5× DPR 软化（可选开关） | CSS | 🟢 低 | ⭐⭐⭐ | ⭐⭐⭐ |
| 8 | Octopath HD-2D 整体管线 | 整体 | 🔴 高 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 3. 推荐落地顺序（如果未来要做）

1. **第一批（一周内，最高 ROI）**
   - 全部 canvas 纹理加 `NearestFilter`（一行属性）
   - `MeshToonMaterial` 全场景加 3 阶 `gradientMap` + `NearestFilter`
   - drei `<Outlines screenspace>` 包裹 Signpost / Campfire / 树丛 / 小鸟 / 鸟剪影
2. **第二批（一个月内，整体感升级）**
   - 颜色量化 + Bayer dither 后处理 pass
   - SkyDome 域扭曲 fBm 着色器替换当前 noise
   - 远景树丛改 billboard impostor
3. **第三批（长期 / 玩法扩展）**
   - 引入小猫角色（inverted-hull 描边 + toon 材质）
   - Octopath HD-2D 整体管线
   - 猫漫游触发"星星视角切换"等微动效

---

## 六、待用户决策的设计问题

> 这些问题不在本次研究范围内，但研究过程中浮现。

| 问题 | 选项 |
|------|------|
| **星星是否"按访问频次变亮变大"？** | A. 民主平等（更治愈，Are.na 风）/ B. 数据驱动（更实用，Heimdall 风） |
| **是否引入小猫角色作为场景切换引导？** | A. 不引入（保持当前 toon 自然场景）/ B. 引入（CLAUDE.md 提的设计待定） |
| **是否给场景二（星空）也加粒子雾 / 云带？** | 当前是纯星空；可加"夜云缓缓飘过"强化氛围 |

---

## 七、参考来源汇总

### new-tab 扩展
- Tabliss — https://github.com/joelshepherd/tabliss
- Momentum — https://momentumdash.com
- Bonjourr — https://github.com/bonjourr/bonjourr
- Bruno Simon — https://bruno-simon.com
- Active Theory — https://activetheory.net
- Awwwards — https://www.awwwards.com/websites/three-js/

### 书签 / 收藏夹可视化
- Are.na — https://www.are.na
- nightTab — https://addons.mozilla.org/en-US/firefox/addon/nighttab/
- Homer — https://github.com/bastienwirtz/homer
- Heimdall — https://github.com/linuxserver/Heimdall
- Raindrop.io — https://raindrop.io
- Pocket — https://en.wikipedia.org/wiki/Pocket_(service)
- BookmarksMap — https://github.com/tautcony/BookmarksMap
- TimeMap / SIMILE — https://github.com/simile-widgets/timemap
- HistoryMap — https://historymap.info
- Lost at Night — https://www.lostateminor.org
- Session Buddy — https://chromewebstore.google.com/detail/session-buddy-tab-bookma/edacconmaakjimmfjnbloccmbclgghlo
- Flame — https://flame.labnotes.org

### Three.js / R3F 技法
- three.js MeshToonMaterial — https://threejs.org/docs/#api/en/materials/MeshToonMaterial
- three.js OutlinePass — https://threejs.org/examples/?q=outline
- drei `<Outlines>` — https://github.com/pmndrs/drei#outlines
- drei `<MeshToonMaterial>` — https://github.com/pmndrs/drei#meshtoonmaterial
- @react-three/postprocessing — https://github.com/pmndrs/postprocessing
- The Book of Shaders (Noise) — https://thebookofshaders.com/13/
- Inigo Quilez (Domain Warping) — https://iquilezles.org/articles/warp/
- Ni no Kuni — https://en.wikipedia.org/wiki/Ni_no_Kuni
- Octopath Traveler — https://en.wikipedia.org/wiki/Octopath_Traveler
- Cel shading — https://en.wikipedia.org/wiki/Cel_shading

---

## 八、原始研究文档

如需更详细的逐项目分析：

- `~/.claude/plans/async-sprouting-ritchie-agent-a447fea43facbb9b6.md` — 14 个书签/可视化项目深度分析
- 其他两个 Explore 代理的原始报告（已内联综合到本文件）

---

## 九、版本

- v1.0（2026-06-05）：初版。基于 3 个 Explore 代理的研究综合。
- 后续如采纳任何技法落地，本文档应同步更新到「已落地」清单。
