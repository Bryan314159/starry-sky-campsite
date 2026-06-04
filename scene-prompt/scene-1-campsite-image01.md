# 场景一 · 营地路牌 — MiniMax image-01 直接复制版

> **目标模型**：`image-01`（MiniMax / 稀宇科技）
> **支持宽高比**：1:1 / 16:9 / 4:3 / 3:2 / 2:3 / 3:4 / 9:16 / 21:9
> **推荐比例**：**16:9**（与新标签页视口最接近；image-01 不支持 16:10）
> **模型特点**：
> - 支持 `promptOptimizer`（默认 true，会自动润色 prompt）
> - 接受纯自然语言，无需 `--ar` 等特殊参数
> - 中文 prompt 支持良好（可与英文版二选一）

---

## 一、英文 Prompt（推荐 · 跨模型兼容性好）

```
A serene 2D hand-drawn illustration in the style of "The Legend of Luo Xiaohei" 
(Luo Xiaohei Zhan Ji, MTJJ, Chinese animation 2011-2025), 
flat color blocks with no painted shadows, 
soft watercolor background with visible brush strokes, 
rounded thick outlines like a children's storybook, 
low saturation Chinese ink-wash color palette, 
healing and meditative atmosphere, 
Studio Ghibli meets Chinese ink painting aesthetic, 
gentle ambient light without harsh highlights.

Wide shot, golden hour evening. A rustic wooden signpost stands alone on a grassy 
field at the right-third golden intersection of the frame. The signpost is a tall 
cylindrical log-pole with visible vertical wood grain, warm umber and walnut color 
variations, small knots and cracks suggesting age and authenticity. Five 
cream-white directional boards are nailed at various heights and angles, each 
pointing to a different direction (some left, some right, some up-tilted, some 
down-tilted). Boards are flat rectangular planks with rough hand-cut edges and 
hand-painted Chinese character placeholders (illegible scribbles, no readable text).

A winding dirt path starts at the bottom-center foreground and curves gently into 
the distant forest depth, vanishing into a misty horizon. Path is packed earth 
with scattered pebbles and tiny grass tufts on both sides. A single small campfire 
stone-ring sits softly in the midground left as a quiet visual anchor.

Low horizon line at upper one-third: sky takes 35%, ground takes 65%. Foreground 
grass with soft bokeh-like focus blur, midground signpost crisp and detailed, 
background forest trees fading into atmospheric perspective. Slight warm 
sunlight from upper-left. No tilt, no close-up, no Dutch angle, no fisheye, 
no portrait crop, natural 60 degree perspective.

Warm color palette: grass green sage #7BA05B, dark green shadow #4A6B3F, 
light moss highlight #9DBA73; wood brown warm umber #A07A4C, dark walnut 
grain #6B4E2E; board cream moonstone white #F4E8D0; path earth warm 
sand #C4A46C; sky gradient peach #FFCBA4 near horizon, champagne #F7E7CE 
mid sky, soft blue #B5C7D9 at zenith; accent ochre yellow #D4A155 for 
warm sunlight on the pole; tiny cinnabar red #C75D4A dot on one board 
as a subtle visual focus.

DO NOT include: any person, cat, animal, human figure, multiple signposts, 
English text, readable text on boards, corporate logo, watermark, signature, 
3D render, photorealistic, CGI, glossy plastic, metal reflection, neon 
colors, fluorescent colors, primary colors, anime style, Pixar style, 
Disney style, cluttered composition, busy background, motion blur, lens flare.
```

---

## 二、中文 Prompt（备选 · MiniMax 中文理解力强）

```
罗小黑战记（MTJJ 导演，2011-2025 中国动画）风格的二维手绘插画。
平涂色块、无线稿阴影，柔和水彩背景带可见笔触，儿童绘本式的粗圆描边，
低饱和中国传统水墨色，治愈冥想的氛围，吉卜力融合中国水墨美学，
柔和环境光无刺眼高光。

广角镜头，傍晚黄金时刻。一根原木路牌柱矗立在草地上，位于画面右三分黄金
分割点。圆柱形原木主柱可见垂直木纹，暖琥珀到深胡桃色色变，小木节和裂纹
显示岁月感。柱上钉着 5 块奶白色方向指示木板，各在不同高度和角度，指向
不同方向（左、右、上倾、下倾），平面长方形板，边缘手工切割的粗糙感，
板上仅有手绘中文占位字样（不可识别的涂鸦，无可读文字）。

一条蜿蜒泥土小径从前景底部中央向远处森林延伸，消失于雾蒙蒙的地平线。
小径是压实的泥土，两侧散落小石子和零星草丛。中景左侧有一圈用石头围成
的小篝火遗迹作为视觉锚点。

地平线位于画面上方 1/3：天空占 35%，地面占 65%。前景草地带柔和焦外
虚化，中景路牌柱清晰，远景森林树木在雾中淡入大气透视。左上方有暖金
阳光斜照。无倾斜、无特写、无鱼眼、无人像裁切，60 度自然视角。

暖色调色板：草地绿鼠尾草 #7BA05B、暗绿阴影 #4A6B3F、浅苔藓高光 #9DBA73；
木头棕暖琥珀 #A07A4C、深胡桃色木纹 #6B4E2E；木板奶油月光白 #F4E8D0；
泥土小径暖沙棕 #C4A46C；天空渐变地平线桃色 #FFCBA4、中天香槟 #F7E7CE、
顶部柔蓝 #B5C7D9；暖金高光 #D4A155 照在主柱；小块朱砂红 #C75D4A 圆点
在某块木板上作视觉焦点。

不要出现：人、猫、动物、人物角色、多根路牌柱、英文文字、可读文字、
企业 logo、水印、签名、3D 写实、CGI、光滑塑料、金属反光、霓虹色、
荧光色、纯原色、日式动漫、迪士尼、皮克斯风格、拥挤构图、繁忙背景、
运动模糊、镜头光晕。
```

---

## 三、调用参数建议

```json
{
  "model": "image-01",
  "prompt": "<上方英文或中文 prompt 整段>",
  "aspectRatio": "16:9",
  "n": 4,
  "promptOptimizer": true
}
```

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `model` | `image-01` | 目标模型 |
| `aspectRatio` | `16:9` | 替代不支持的 16:10；新标签页视口最接近 |
| `n` | 4 | 一次跑 4 张，挑 1 张最贴的 |
| `promptOptimizer` | `true`（默认） | 让模型自动润色；如效果跑偏可改 `false` 完全按原文绘制 |

---

## 四、若首轮不满意，调参指南

| 问题 | 修改方向 |
|------|---------|
| 出现小猫 / 人物 | 在末尾强化："Absolutely no character, no creature, no living being, no human, no animal" |
| 画面太暗 / 不够"傍晚" | 把 sky gradient 三个 hex 全部提亮 10–15%（如 peach → `#FFD8B5`） |
| 路牌柱太"塑料" | 在主体段追加 "weathered, sun-bleached patches, hand-hewn, rough bark texture" |
| 草地太单调 | 在 PALETTE 段追加更多绿色变体：`#5A7A4A, #B0CC8A, #6E8B52` |
| 出现英文指示牌文字 | 在主体段强化："boards have only illegible Chinese character scribbles, NO English, NO Latin alphabet" |
| 整体太"3D 写实" | 在 prompt 开头加 "STRICTLY 2D HAND-DRAWN, NOT 3D, NOT CGI, NOT RENDERED" |
| promptOptimizer 加料太多 | 设 `promptOptimizer: false`，完全按 prompt 描述绘制 |
| 想要不同景别 | 删掉 "wide shot" 改 "medium shot"（拉近）或 "panoramic view"（拉远） |

---

## 五、文件清单

| 文件 | 用途 |
|------|------|
| `scene-1-campsite-image01.md` | 本文件（详细文档 + 英文 prompt + 中文 prompt + 调参指南） |
| `scene-1-campsite.md` | 通用结构化 prompt 设计文档（Midjourney / DALL·E 3 / SDXL 多模型版本） |
| `scene-1-campsite-midjourney.md` | Midjourney v6 单行复制版 |
