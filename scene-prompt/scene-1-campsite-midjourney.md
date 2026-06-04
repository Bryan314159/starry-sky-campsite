# 场景一 · 营地路牌 — Midjourney 直接复制版

> 配套说明文档：[scene-1-campsite.md](./scene-1-campsite.md)
> 适用于：Midjourney v6+
> 宽高比：16:10（与 3D 场景视口一致）

---

## 完整 Prompt（复制即用）

```
A serene illustration in the style of "The Legend of Luo Xiaohei" (Luo Xiaohei Zhan Ji, MTJJ, 2011-2025), 2D hand-drawn animation cel, flat color blocks with no painted shadows, soft watercolor background with visible brush strokes, rounded thick outlines like a children's storybook, low saturation Chinese ink-wash color palette (sage green, moonstone white, ink-blue, ochre yellow, cinnabar red, dark teal), healing and meditative atmosphere, Studio Ghibli x Chinese ink painting fusion aesthetic, gentle ambient light without harsh highlights, a rustic wooden signpost standing alone on a grassy field, a tall cylindrical log-pole trunk with 5 cream-white directional boards nailed at various heights and angles, each board pointing to a different direction (some left, some right, some up-tilted, some down-tilted), boards are flat rectangular planks with hand-painted Chinese character placeholders, a winding dirt path starts at the bottom-center foreground and curves gently into the distant forest depth, vanishing into the horizon, the wooden pole has visible vertical wood grain with warm umber and walnut color variations, knots and small cracks in the bark suggest age and authenticity, boards are moonstone-white with subtle warm tint and rough hand-cut edges, path is packed earth with scattered pebbles and tiny grass tufts on both sides, in a quiet golden-hour evening, the boards cast no painted shadows on the pole, the grass blades are still, no wind, a single small campfire stone-ring sits softly in the midground left as a quiet visual anchor, the signpost feels alive but peaceful, like a waystation waiting for travelers, wide shot, low horizon line placed at upper one-third, sky takes 35%, ground takes 65%, signpost placed at right-third golden intersection, rule of thirds, path leading line starts at bottom-center and recedes into deep vanishing point, foreground grass with soft bokeh-like focus blur, midground signpost crisp and detailed, background forest trees fading into atmospheric perspective with mist, slight warm sunlight from upper-left, golden hour direction, no tilt, no Dutch angle, no fish-eye, no ultra-wide distortion, natural 60 degree FOV perspective, no close-up, no portrait crop, warm color palette: grass green sage #7BA05B, dark green shadow #4A6B3F, light moss highlight #9DBA73, wood brown warm umber #A07A4C, dark walnut grain #6B4E2E, board cream moonstone white #F4E8D0, path earth warm sand-brown #C4A46C, sky gradient peach #FFCBA4 near horizon, champagne #F7E7CE mid sky, soft blue #B5C7D9 at zenith, accent ochre yellow #D4A155 for warm sunlight on the pole, accent cinnabar red #C75D4A as a tiny painted dot on one board --ar 16:10 --style raw --stylize 50 --chaos 5 --no photorealistic, 3D render, CGI, smooth gradient shading, harsh shadows, high saturation, neon colors, fluorescent colors, primary colors, sharp thin lines, mechanical vector lines, anime style japanese, Pixar style, Disney style, cluttered composition, busy background, glossy plastic, metal reflection, lens flare, motion blur, multiple signposts, person, human figure, cat, animal character, text written in English, readable text on boards, corporate logo
```

---

## 参数速查

| 参数 | 值 | 含义 |
|------|-----|------|
| `--ar 16:10` | 16:10 | 与 3D 场景视口、Chrome Web Store 头图比例一致 |
| `--style raw` | raw | 减少 Midjourney 自动加料（避免多加猫/人） |
| `--stylize 50` | 50 | 低风格化，保留 prompt 细节控制力 |
| `--chaos 5` | 5 | 轻微变化，4 选 1 时构图差异不过大 |

---

## 备选版本（中文比例 / 仅 Midjourney 用）

如果偏好纯中文风格引导，可把 SUBJECT 部分改为：

```
... 一根矗立在草地上的原木路牌柱，圆柱形原木主柱可见垂直木纹，木柱上钉着 5 块奶白色方向指示木板各指不同方向，一条蜿蜒泥土小径从前景延伸至远方森林深处消失在雾中，傍晚黄金时刻，安静治愈氛围 ...
```

然后在末尾追加 `--v 6.1` 强制使用最新模型。

---

## 跑图小贴士

1. **第一次跑**：直接复制上方「完整 Prompt」，期望 4 选 1 中至少 1 张构图贴近
2. **第二次跑**：若整体偏暗，把 sky gradient 三个 hex 全部提亮 10%
3. **第三次跑**：若出现小猫/人，加 `--no person, cat, animal, human, character`
4. **第四次跑**：若想要更"罗小黑"风格，prompt 开头追加 `MTJJ director style, Beijing RT-Mart studio 2019 film aesthetic,`
5. **终稿筛选**：挑出 1 张最贴后用 Midjourney 的 `U` 按钮升档，再 `Vary (Subtle)` 微调

---

> **本文件不直接修改**。如需更新 prompt，回到 [scene-1-campsite.md](./scene-1-campsite.md) 修改后重新生成此文件。
