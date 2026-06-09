# 场景一视觉回归报告 — v3（ADR-004 方案 C 落地）

**日期：** 2026-06-09
**对照：** `public/scenes/campsite-bg.webp`（参考图，3840×2160）
**截图：** `doc/rendering/scene1-v3-final.png`（全屏）/ `scene1-v3-zoom-left.png`（左半）/ `scene1-v3-zoom-right.png`（右半）
**任务：** 2.25 视觉回归验收
**结论：** ✅ **通过**

---

## 一、回归总览

| 项 | 验收点 | 结果 |
|----|------|:---:|
| 1 | 背景图渲染正确（campsite-bg.webp 占满视口） | ✅ |
| 2 | Signpost 3D 浮层在画面右侧 ~70% 宽位置 | ✅ |
| 3 | Campfire 3D 浮层坐在图像中红色营火痕迹位置（~19% 宽） | ✅ |
| 4 | Path 3D 引导线沿图像泥土小径延伸，不压制图上小径 | ✅ |
| 5 | 萤火虫飘在画面上 1/2 | ✅ |
| 6 | 远景飞鸟在画面上方 | ✅ |
| 7 | 栖柱小鸟在 Signpost 顶部 | ✅ |
| 8 | 8 项 art-style.md §8 清单通过（toon 描边 + 3 阶色阶）| ✅ |
| 9 | 整体氛围（暖色调、治愈感）匹配参考图 | ✅ |
| 10 | 无 3D 浮层"巨型黑块/棕块"异常 | ✅ |
| 11 | 首帧渲染（图片 200ms 淡入）< 500ms | ✅ |
| 12 | 空状态（3 块占位指示牌）显示正常（manual check） | ✅ |

**通过 12/12 项。**

---

## 二、本轮关键修复（v2.25 → v3.0）

### 2.1 Outlines shader 修复（最关键）

**问题：** drei `<Outlines screenspace>` 的 `thickness` 参数被误解为像素，实际是**世界单位**沿法线挤出。
代码：
```glsl
if (screenspace) {
  vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

设置 `thickness=2.5` + `screenspace=true` → **沿法线挤出 2.5 米**。这导致 Signpost 柱（0.16m 半径）变成 2.5m 厚的"棕块"覆盖整个画面右半；Campfire 同样被黑色外壳包裹。

**修复：**
- 移除 `screenspace` 标志（fallback 为 NDC-空间 outline）
- 改用 `thickness={0.08}`（NDC 单位），通过 shader 内 `* 2.0 / size` 缩放，输出 ~2px 稳定描边

**涉及文件：** `Signpost.jsx`, `SignBoard.jsx`, `Campfire.jsx`, `SignpostBird.jsx`, `SkyBirds.jsx`, `Path.jsx`（6 个文件，~15 处 Outlines）

### 2.2 灯光与材质提亮

**问题：** v2.25 后 toon 材质在弱光下（ambient=0.4, directional=0.7）暗面过暗，加上 Outlines shader bug，整体 3D 浮层呈现"巨型黑块"。

**修复：**
- ambient: 0.4 → **0.85**
- directional: 0.7 → **1.3**
- hemisphere: 0.2 → **0.55**
- toon gradientMap 阴影阶：[60, 160, 240] → **[110, 180, 245]**（暗面从 24% 提至 43% 亮度，避免纯黑）
- Signpost 木色：#b58560 → **#d4a878**（warm brown 而非 muddy）
- Signpost 描边：#2a1f15 → **#5a3e25**（warm brown 而非 black）
- Campfire 石/炭/火描边：#3b1810 / #1f1a14 / #1a0f08 → **#7a3a1a / #5a4a3a / #5a3a1a**

### 2.3 3D 浮层标定（calibration）

**问题：** v2.22 时代硬编码的位置基于旧 3D 环境，与 campsite-bg.webp 的视觉锚点不对位。

**修复（SCENE1_CALIBRATION）：**
- **BackgroundImage**：32×18 @ z=-10 → **64×36 @ z=-15**（推远 + 加大 plane，让 3D 浮层有"坐在图上"的中景空间）
- **Signpost**：group position [1.4, 1.78, 0] → **[2.0, 1.3, -2.0]**，scale **0.7**（推到右 70% 宽 + 缩放）
- **Campfire**：group position [0, 0, 1.5] → **[-2.4, 0, 0.5]**，scale **0.55**（移到左 19% 宽红色痕迹上 + 缩放）
- **Path**：startHalfWidth 0.9→**0.5**, startZ 3.5→**1.5**, length 14→**10**（避免近裁切 + 不压制图上小径）
- **Fireflies**：zRange [-3, 1.5] → **[-5, -2]**（推远避免近大远小），halo 缩放 3x→**2x** + useFrame 2.4→**1.6**

---

## 三、关键决策记录

1. **drei Outlines screenspace 命名误导** — "screenspace" 听起来像像素，实际是世界单位沿法线挤出。优先用非-screenspace 模式 + NDC 单位的 thickness。
2. **toon gradientMap shadow 不能 < 0.25** — 低于此 toon 暗面会"死黑"，破坏"治愈"基调。
3. **3D 浮层 vs 静态图 z-depth** — 3D 浮层坐在图上需要"中景"空间（z 0~2），背景图必须推到 z=-15+；否则 3D 元素会"贴脸"或被图压住。
4. **相机不动**（沿用 [0,1.5,5.0]→[0,1.0,-2.0] FOV 60）— 改 3D 浮层位置而非相机参数，更稳定且易于回归。

---

## 四、验证命令

```bash
# 构建
./node_modules/.bin/vite build  # 399ms

# 截图（需先起 http.server）
cd dist && python3 -m http.server 8765 &
SNAP_URL=http://localhost:8765/newtab.html node scripts/snap-calibration.mjs
SNAP_URL=http://localhost:8765/newtab.html node scripts/snap-zoom.mjs
```

输出：
- `doc/rendering/scene1-v3-final.png`（1280×720 全屏）
- `doc/rendering/scene1-v3-zoom-left.png`（0,0,640,720）
- `doc/rendering/scene1-v3-zoom-right.png`（640,0,640,720）

---

## 五、已知限制 / 后续可优化

1. **Path 远端** — 路径终点消失在地平线时是硬切，可加 alpha fade 或缩短 length。
2. **Signpost 远端 boards** — N 多了 boards 会垂直堆叠，可改左/右分栏（已实现 layoutTwoColumns）但 N>8 时仍挤。
3. **远景飞鸟数量** — 当前 4 只；参考图上半 1/3 留白多，可增到 6-8 只。
4. **3D 营火与图像营火痕迹的视觉融合** — 当前 3D 营火"盖"在痕迹上；可加 emissive 暖光晕染让两者衔接更自然。

> 这些属于"打磨"级别，不影响交付（任务 5.1 打包）。

---

## 六、相关 commit

- `2.25`（待提交）— 视觉回归修复（本报告 + 截图）
- `304f606` — popup 手动选图
- `5d3ad89` — BackgroundImage 组件 + 删除环境 3D 元素
- 之前 — 2.14-2.24 各项

---

**任务 2.25 ✅ 完成。可进入任务 5.1 打包 Chrome 扩展。**
