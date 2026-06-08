# 场景一 · 营地背景图 — MiniMax image-01 直接复制版

> **目标模型**：`image-01`（MiniMax / 稀宇科技）
> **需求来源**：`doc/scene/scene1-background-image-requirements.md` v1.0
> **配套文档**：
> - `doc/scene/scene1-background-image-requirements.md` — 完整提供要求清单
> - `doc/decisions/ADR-004-scene1-photo-plus-3d-overlay.md` — 方案 C（静态图 + 3D 浮层）
> - `doc/art-style.md` — 画风基准
> - `doc/scene-design.md` — 场景一构图

---

## 一、英文 Prompt（1395 字符 ✅）

→ 完整内容见 [`scene-1-background-image01-en.txt`](./scene-1-background-image01-en.txt)

## 二、中文 Prompt（416 字符 ✅）

→ 完整内容见 [`scene-1-background-image01-zh.txt`](./scene-1-background-image01-zh.txt)

---

## 三、调用参数建议

```json
{
  "model": "image-01",
  "prompt": "<EN 或 ZH prompt 整段>",
  "aspectRatio": "16:9",
  "n": 4,
  "promptOptimizer": true
}
```

| 参数 | 推荐值 | 原因 |
|------|--------|------|
| `aspectRatio` | `16:9` | 需求 H1 强制 3840×2160 (16:9) |
| `n` | 4 | 一次跑 4 张挑 1 |
| `promptOptimizer` | `true`（默认）| 需求复杂，自动润色有助于效果稳定 |

---

## 四、需求对齐（与 scene1-background-image-requirements.md §1-§6 对照）

### 4.1 硬性规格（H1-H7）

| # | 需求 | Prompt 中的体现 |
|---|------|---------------|
| H1 | 尺寸 3840×2160（16:9）| 调用参数 `aspectRatio: "16:9"` |
| H2 | 格式 .webp | 转 webp 由人类/工具处理（H2 注明）|
| H3 | 地平线**自下而上约 1/3** | "horizon line at lower one-third (sky 2/3, ground 1/3)" |
| H4 | 构图空区（路牌插入位）| "center of the frame is intentionally calm and uncluttered, leaving a clean open area" |
| H5 | 天空区 / 地面区边界柔和可辨 | 天空渐变描述 + 地面绿色斑驳 |
| H6 | 版权清晰 | 由用户提供（自备图，AI 生成图不能解决 H6）|
| H7 | 横向 16:9 | 16:9 参数 |

### 4.2 色系 / 氛围（C1-C6）

| # | 需求 | Prompt 中的体现 |
|---|------|---------------|
| C1 | 暖色系（黄昏）| "golden hour dusk" + "warm grass" |
| C2 | 低饱和度（治愈系）| "low saturation Chinese ink-wash palette" + "healing meditative atmosphere" |
| C3 | 天空暖橘→淡紫/淡蓝柔和渐变 | 三个 hex 渐变：peach #FFCBA4 → champagne #F7E7CE → soft blue #B5C7D9 |
| C4 | 地面暖绿 + 木棕点缀 | "warm grass green #7BA05B" + 暗斑 #4A6B3F |
| C5 | 治愈 / 静谧 / 温暖 | "healing meditative atmosphere" + "calm lakeside" |
| C6 | 漫射光（无强阴影）| "diffuse ambient light without harsh highlights" |

### 4.3 应出现的元素（§3）

| 区域 | 应出现 | Prompt 中的体现 |
|------|--------|---------------|
| 天空区（上 2/3）| 远山轮廓 / 远树剪影 | "soft distant mountain silhouettes and faint tree silhouettes on the far shore" |
| 地平线（中 1/3）| 湖面 / 远树林 | "calm lake with soft sky reflections" |
| 地面区（下 1/3）| 草地 / 几块石 / 篝火痕迹 | "warm grass green with darker patches" + "natural campfire site (circle of stones with scorched earth)" |
| 前景 | 小路从底部延伸到地平线 | "winding dirt path starts at the bottom-center edge and recedes toward the horizon at the center" |

### 4.4 不要出现的元素（§4）

| 不要 | Prompt 中已排除 |
|------|---------------|
| ❌ 人 / 角色 | "no person, cat, animal" |
| ❌ 路牌 / 指示牌 | "no signpost, signboards, boards with text" |
| ❌ 文字 / 水印 / 签名 | "no readable text, English text, watermark, signature" |
| ❌ 汽车 / 帐篷 / 现代物品 | "no tent, car, modern item" |
| ❌ 人工结构 | "no building, fence, power line" |
| ❌ 萤火虫 / 飞行小鸟 | "no fireflies, birds in flight"（3D 浮层添加）|

### 4.5 视觉锚点（§5）

| 锚点 | Prompt 中的体现 |
|------|---------------|
| 路牌接触点（地面正中央略前）| "center is calm and uncluttered, leaving a clean open area" + path recedes to center |
| 篝火痕迹（地面一侧）| "campfire site off-center in the lower foreground, gently off to one side" |
| 小路起点（正下方边缘）| "path starts at the bottom-center edge" |
| 小路终点（地平线）| "recedes toward the distant horizon at the center" |
| 天空 1/2 高度（不要太满）| "soft warm gradient" + "soft distant mountain silhouettes"（不堆细节）|

### 4.6 不需要的内容（§6）

| 不要 | Prompt 中已排除 |
|------|---------------|
| ❌ 强反光 | "no mirror reflection" |
| ❌ 大量细节 | 描述克制，不堆砌 |
| ❌ 8-bit / 像素 / 油画厚笔 | STYLE_PREFIX 中的 "2D hand-drawn" + "soft watercolor" 已隐含 |
| ❌ 多焦点 / 复杂透视 | "wide shot" + 中心简洁留空 |

---

## 五、与早期 prompt 的关键差异（ADR-004 引入的变化）

| 维度 | 旧版（场景一整体图）| **新版（场景一背景图）** |
|------|------------------|----------------------|
| 用途 | 完整场景一主图 | **场景一背景图**（静态 + 3D 浮层）|
| 比例 | 16:9（推荐）/ 16:10 | **16:9 强制**（4K 显示要求）|
| 地平线位置 | 上方 1/3（地面为主体）| **下方 1/3（天空为主体）** ← 关键变化 |
| 路牌柱 | ✅ 应出现在 prompt 中 | ❌ **不应出现**（3D 浮层加）|
| 篝火 | 小型石圈作为氛围元素 | **强烈推荐**自然篝火痕迹（视觉锚点）|
| 萤火虫 / 小鸟 | 隐含在氛围中 | ❌ **不应出现**（3D 浮层加）|
| 小猫 | 可选 | ❌ **不应出现**（3D 浮层加）|
| 中心构图 | 路牌在右 1/3 黄金点 | **中央留空**（供 3D 路牌插入）|
| 草地范围 | 65% | **1/3** |
| 天空范围 | 35% | **2/3** |
| 治愈感 | 强调 | 强调 + "calm lakeside"（Q2 推荐：湖边）|
| 决策偏好 | — | Q1 黄昏金 / Q2 湖边 / Q3 简洁 |

---

## 六、调参指南（首轮不满意时）

| 问题 | 修改方向 |
|------|---------|
| 出现路牌 / 萤火虫 / 小鸟 | 强化 NEGATIVE："ABSOLUTELY no signpost, no fireflies, no birds, no creatures" |
| 中心不"干净" | 强化："center must be calm, uncluttered, no tall objects, no trees in center" |
| 缺少篝火痕迹 | 在主体段把 "circle of stones with scorched earth" 加粗 |
| 出现镜面反射 | 在主体段追加 "no mirror-like water reflection" |
| 草地不够暖 | 调整 hex：#7BA05B → #8AAE6A（更暖）|
| 天空太蓝 | 把 mid sky 的 #F7E7CE 调暖到 #FFE8C4 |
| 远景太抢戏 | 弱化描述："very faint, very distant" 而非 "distant mountain silhouettes" |
| 出现可读文字 | NEGATIVE 加 "no labels, no plaques, no readable characters, no Western text" |
| 整体太"3D 写实" | 开头加 "STRICTLY 2D HAND-DRAWN, NOT 3D, NOT CGI" |

---

## 七、文件清单

| 文件 | 字符数 | 用途 |
|------|:------:|------|
| `scene-1-background-image01-en.txt` | 1395 | 英文纯 prompt（直接复制） |
| `scene-1-background-image01-zh.txt` | 416 | 中文纯 prompt（直接复制） |
| `scene-1-background-image01.md` | — | 本文档（需求对齐 + 差异表 + 调参指南） |

---

## 八、版本与变更

- v1.0（2026-06-05）：初始版本。基于 `doc/scene/scene1-background-image-requirements.md` v1.0 + `art-style.md` §4.3 + `ADR-004` 方案 C 编写。
