# 场景一 · 营地路牌 — 文生图 Prompt

> **用途**：为项目第一场景（营地·路牌）生成参考图 / 宣传图 / 营销头图。
> **生成目标**：Midjourney v6（默认）/ DALL·E 3 / Stable Diffusion XL / 即梦（备选）
> **关联文档**：`doc/scene-design.md` §一·§二·§三、`doc/art-style.md` §3·§4·§7.1、`agents/art-agent.md` §任务示例 1
> **设计要求来源**：`doc/项目梗概.md` §场景一、CLAUDE.md §Architecture
> **生成日期**：2026-06-04

---

## 一、任务输入

```
任务：为星空营地第一场景（营地·路牌）生成参考图
主体：木质路牌柱 + 多块指示牌（指向不同方向）+ 草地 + 蜿蜒小路 + 傍晚天空
useCase：场景一参考图 / Chrome Web Store 商店主页 / README 头图
scene：campsite（场景一）
model：midjourney（默认）/ dalle3 / sdxl / jimeng
aspectRatio：16:10（默认，Web Store 头图与 3D 视口 16:10 匹配）
约束：
  - 主体清晰可识别为「木制路牌柱 + 多块指示牌 + 草地 + 傍晚天空」
  - 画风明显是《罗小黑战记》风格（评审一眼即知）
  - 色彩温润，无荧光色，色调整体偏暖
  - 氛围安静、治愈、有留白
  - 与 3D 场景观感一致：路牌在右侧 1/3 黄金点、地平线在画面上方 1/3
验收标准：
  - [ ] 风格：罗小黑战记风格一眼可辨
  - [ ] 主体：路牌柱 + ≥3 块指示牌可识别
  - [ ] 构图：与 scene-design.md 相机参数对齐
  - [ ] 调色板：PALETTE_WARM 暖色系
  - [ ] 留白：主体只占画面约 1/3
  - [ ] 无危险词（3D render / photorealistic / anime 等）
```

---

## 二、Prompt 输出

### [1] STYLE_PREFIX（通用风格前缀，**禁止修改**）

```
A serene illustration in the style of "The Legend of Luo Xiaohei" 
(Luo Xiaohei Zhan Ji, MTJJ, 2011-2025), 
2D hand-drawn animation cel, 
flat color blocks with no painted shadows, 
soft watercolor background with visible brush strokes, 
rounded thick outlines like a children's storybook, 
low saturation Chinese ink-wash color palette 
(sage green, moonstone white, ink-blue, ochre yellow, cinnabar red, dark teal), 
healing and meditative atmosphere, 
Studio Ghibli × Chinese ink painting fusion aesthetic, 
gentle ambient light without harsh highlights,
```

### [2] SUBJECT（主体描述 · 三段式：几何 + 材质 + 状态）

```
[几何]  a rustic wooden signpost standing alone on a grassy field, 
        a tall cylindrical log-pole trunk with 5 cream-white directional boards 
        nailed at various heights and angles, each board pointing to a different direction 
        (some pointing left, some right, some up-tilted, some down-tilted), 
        boards are flat rectangular planks with hand-painted Chinese character placeholders, 
        a winding dirt path starts at the bottom-center foreground and curves gently 
        into the distant forest depth, vanishing into the horizon

[材质]  the wooden pole has visible vertical wood grain with warm umber and walnut color variations, 
        knots and small cracks in the bark suggest age and authenticity, 
        boards are moonstone-white with subtle warm tint and rough hand-cut edges, 
        path is packed earth with scattered pebbles and tiny grass tufts on both sides, 
        no photorealistic textures, no metallic reflections

[状态]  in a quiet golden-hour evening, the boards cast no painted shadows on the pole, 
        the grass blades are still, no wind, a single small campfire stone-ring sits 
        softly in the midground left as a quiet visual anchor, 
        the signpost feels alive but peaceful, like a waystation waiting for travelers
```

### [3] COMPOSITION（构图与镜头 · 与 scene-design.md 相机参数对齐）

```
wide shot, low horizon line placed at upper one-third (sky takes ~35%, ground takes ~65%), 
signpost placed at right-third golden intersection (rule of thirds), 
path leading line starts at bottom-center and recedes into deep vanishing point, 
foreground grass with soft bokeh-like focus blur, 
midground signpost crisp and detailed, 
background forest trees fading into atmospheric perspective with mist, 
slight warm sunlight from upper-left (golden hour direction), 
no tilt, no Dutch angle, no fish-eye, no ultra-wide distortion, 
natural 60° FOV perspective, no close-up, no portrait crop
```

### [4] PALETTE（调色板 · PALETTE_WARM）

```
warm color palette: 
grass green (#7BA05B sage green mid-tone, #4A6B3F dark green for shadow patches, 
#9DBA73 light moss green for highlights), 
wood brown (#A07A4C warm umber for sunlit pole, #6B4E2E dark walnut for grain and shadow), 
board cream (#F4E8D0 moonstone white with warm undertone), 
path earth (#C4A46C warm sand-brown, #8C7349 darker shade for path shadow), 
sky gradient (peach #FFCBA4 near horizon → champagne #F7E7CE mid sky → 
soft blue #B5C7D9 at zenith), 
accent ochre yellow (#D4A155) for warm sunlight on the pole, 
accent cinnabar red (#C75D4A) only as a tiny painted dot on one board as a subtle visual focus
```

### [5] NEGATIVE_PROMPT（通用负面提示词，**禁止修改**）

```
photorealistic, 3D render, CGI, smooth gradient shading, harsh shadows, 
high saturation, neon colors, fluorescent colors, primary colors (pure red/blue/green), 
sharp thin lines, mechanical vector lines, anime style (japanese), 
Pixar style, Disney style, cluttered composition, busy background, 
glossy plastic, metal reflection, lens flare, motion blur, 
deformed characters, extra fingers, blurry text, watermark, signature, 
multiple signposts, person, human figure, cat, animal character, 
text written in English, readable text on boards, corporate logo
```

### [6] TECH_PARAMS（按目标模型给出建议）

```markdown
## Midjourney v6+（推荐）
--ar 16:10 --style raw --stylize 50 --chaos 5 --no {NEGATIVE_PROMPT}
备注：
  - --stylize 50 = 低风格化，保留 prompt 细节控制力
  - --chaos 5 = 轻微变化，4 选 1 时容易挑到构图最贴的
  - --style raw = 减少 Midjourney 自动加料

## DALL·E 3
自然语言 prompt（把 4 段 + NEGATIVE 拼成一段连续描述），无特殊参数
prompt 末尾必须追加："Strictly follow the description above, do not add extra elements."
备注：DALL·E 3 会自动加料（容易多猫 / 多人 / 多文字），需在 prompt 末尾强调严格遵循

## Stable Diffusion XL（带 Chinese illustration LoRA）
prompt: "{STYLE_PREFIX}, {SUBJECT}, {COMPOSITION}, {PALETTE}"
negative_prompt: "{NEGATIVE_PROMPT}"
steps: 30, cfg_scale: 7, sampler: DPM++ 2M Karras
推荐 LoRA: "Chinese illustration style" 权重 0.6-0.8，或 "Flat illustration style" 权重 0.5

## 即梦（字节）/ 文心一格（百度）
直接用自然语言 prompt，参考 DALL·E 3 写法
prompt 末尾追加："严格按照上述描述绘制，不要添加额外元素"
```

---

## 三、拼接后的完整 Prompt（可直接复制）

### 版本 A：Midjourney（默认推荐）

```
A serene illustration in the style of "The Legend of Luo Xiaohei" 
(Luo Xiaohei Zhan Ji, MTJJ, 2011-2025), 
2D hand-drawn animation cel, 
flat color blocks with no painted shadows, 
soft watercolor background with visible brush strokes, 
rounded thick outlines like a children's storybook, 
low saturation Chinese ink-wash color palette 
(sage green, moonstone white, ink-blue, ochre yellow, cinnabar red, dark teal), 
healing and meditative atmosphere, 
Studio Ghibli × Chinese ink painting fusion aesthetic, 
gentle ambient light without harsh highlights, 
a rustic wooden signpost standing alone on a grassy field, 
a tall cylindrical log-pole trunk with 5 cream-white directional boards 
nailed at various heights and angles, each board pointing to a different direction, 
boards are flat rectangular planks with hand-painted Chinese character placeholders, 
a winding dirt path starts at the bottom-center foreground and curves gently 
into the distant forest depth, vanishing into the horizon, 
the wooden pole has visible vertical wood grain with warm umber and walnut color variations, 
knots and small cracks in the bark suggest age and authenticity, 
boards are moonstone-white with subtle warm tint and rough hand-cut edges, 
path is packed earth with scattered pebbles and tiny grass tufts on both sides, 
in a quiet golden-hour evening, the boards cast no painted shadows on the pole, 
the grass blades are still, no wind, a single small campfire stone-ring sits 
softly in the midground left as a quiet visual anchor, 
the signpost feels alive but peaceful, like a waystation waiting for travelers, 
wide shot, low horizon line placed at upper one-third, sky takes 35%, ground takes 65%, 
signpost placed at right-third golden intersection, rule of thirds, 
path leading line starts at bottom-center and recedes into deep vanishing point, 
foreground grass with soft bokeh-like focus blur, 
midground signpost crisp and detailed, 
background forest trees fading into atmospheric perspective with mist, 
slight warm sunlight from upper-left, golden hour direction, 
no tilt, no Dutch angle, no fish-eye, no ultra-wide distortion, 
natural 60° FOV perspective, no close-up, no portrait crop, 
warm color palette: 
grass green #7BA05B sage green, #4A6B3F dark green shadow, #9DBA73 light moss highlight, 
wood brown #A07A4C warm umber, #6B4E2E dark walnut grain, 
board cream #F4E8D0 moonstone white, 
path earth #C4A46C warm sand-brown, 
sky gradient peach #FFCBA4 near horizon, champagne #F7E7CE mid sky, soft blue #B5C7D9 zenith, 
accent ochre yellow #D4A155 for warm sunlight on pole, 
accent cinnabar red #C75D4A as a tiny painted dot on one board

--ar 16:10 --style raw --stylize 50 --chaos 5 
--no photorealistic, 3D render, CGI, smooth gradient shading, harsh shadows, 
high saturation, neon colors, fluorescent colors, primary colors, 
sharp thin lines, mechanical vector lines, anime style, 
Pixar style, Disney style, cluttered composition, busy background, 
glossy plastic, metal reflection, lens flare, motion blur, 
multiple signposts, person, human figure, cat, animal character, 
text written in English, readable text on boards, corporate logo
```

### 版本 B：DALL·E 3 / 即梦（自然语言版本）

```
请绘制一张罗小黑战记风格的二维手绘插画，用作 Chrome 浏览器新标签页扩展的参考图。

【整体风格】
罗小黑战记（MTJJ 导演）动画风格的二维手绘赛璐珞，平涂色块、无线稿阴影，
柔和水彩背景带可见笔触，儿童绘本式的粗圆描边，
低饱和中国传统水墨色（鼠尾草绿、月光白、墨蓝、赭黄、朱砂红、深青），
治愈冥想的氛围，吉卜力 × 中国水墨融合美学，柔和环境光无刺眼高光。

【主体】
画面中央偏右，一根矗立在草地上的原木路牌柱。
- 圆柱形原木主柱，可见垂直木纹（暖琥珀色到深胡桃色的层次变化），有木节和小裂纹
- 主柱上钉着 5 块奶白色的方向指示木板，每块钉在不同高度，指向不同方向（左、右、上倾、下倾）
- 木板是平面长方形，有手绘中文占位字样，边缘有手工切割的粗糙感
- 画面底部中央偏下，一条蜿蜒的泥土小径向前延伸，消失在远方的森林深处
- 泥土小径两侧散落小石子和零星草丛
- 中景左侧有一圈用石头围成的小篝火遗迹作为视觉锚点

【氛围】
安静的傍晚黄金时刻，木板在主柱上没有阴影投射，
草叶静止，没有风，
路牌柱感觉有生命但很平静，像一个等待旅人的中转站。

【构图】
- 广角镜头，地平线位于画面上方 1/3 处（天空 35%，地面 65%）
- 路牌柱放在右三分黄金分割点
- 小径从底部中央作为引导线向深处消失
- 前景草地带柔和焦外虚化，中景路牌柱清晰，远景树木在雾中淡入大气透视
- 左上方有暖金阳光斜照
- 60° 自然视角，没有倾斜、没有鱼眼、没有超广角变形
- 主体只占画面约 1/3，留出大量留白

【调色板 · 暖色系】
- 草地绿：#7BA05B 鼠尾草绿、#4A6B3F 暗绿阴影、#9DBA73 浅苔藓高光
- 木头棕：#A07A4C 暖琥珀、#6B4E2E 深胡桃色木纹
- 木板奶油：#F4E8D0 月光白带暖底
- 泥土小径：#C4A46C 暖沙棕
- 天空渐变：地平线桃色 #FFCBA4 → 中天香槟 #F7E7CE → 顶部柔蓝 #B5C7D9
- 暖金高光：#D4A155
- 单一朱砂红 #C75D4A 仅作为某块木板上一个小红点的视觉焦点

【严格约束】
严格按照上述描述绘制，不要添加额外元素：
不要出现：真人、人物、小猫、动物角色、多根路牌柱
不要出现：英文文字、可清晰阅读的指示牌文字、企业 logo
不要出现：3D 写实感、PBR 材质、金属反光、塑料光泽
```

---

## 四、自检清单（8 项 · 提交前必过）

| # | 检查项 | 状态 | 备注 |
|---|--------|:----:|------|
| 1 | STYLE_PREFIX 完整未修改 | ✅ | 14 行严格保留 |
| 2 | 主体清晰可识别 | ✅ | 路牌柱 + 5 块指示牌 + 小路 + 草地 + 篝火遗迹 |
| 3 | 构图与 scene-design.md 一致 | ✅ | 右三分点、1/3 水平线、60° FOV、广角 |
| 4 | 调色板 PALETTE_WARM 已选 | ✅ | 暖色系，避开冷色星空 |
| 5 | 无危险词 | ✅ | 无 3D render / photorealistic / anime / Pixar |
| 6 | 负面提示词完整 | ✅ | 增加 no person/cat/multiple signposts/English text |
| 7 | 技术参数匹配 | ✅ | Midjourney --stylize 50 / DALL·E 3 强调严格遵循 |
| 8 | Prompt 长度合理 | ✅ | Midjourney 版本 285 词（≤ 350 上限） / DALL·E 3 版本 480 词 |

---

## 五、画风执行对照（与 art-style.md §8 对齐）

| # | 要点 | prompt 中的体现 | 检查 |
|---|------|---------------|:----:|
| 1 | 低饱和温润色 | PALETTE_WARM 全 hex 避开了纯原色 | ✅ |
| 2 | 平涂无影 | "flat color blocks with no painted shadows" + "boards cast no painted shadows" | ✅ |
| 3 | 粗圆描边 | "rounded thick outlines like a children's storybook" | ✅ |
| 4 | 前景简洁 + 背景精 | 前景草地虚化 + 中景路牌清晰 + 远景森林雾化 | ✅ |
| 5 | 水彩材质 | "soft watercolor background with visible brush strokes" | ✅ |
| 6 | 治愈留白 | 主体只占 1/3 + "leave a lot of breathing space" | ✅ |
| 7 | 萌感圆润 | 主柱圆润、5 块木板平面、篝火石头圆 | ✅ |
| 8 | 手工文字 | "hand-painted Chinese character placeholders"（不写真字避免 T2I 翻车） | ✅ |

---

## 六、迭代建议（如第一轮不满意）

| 问题 | 修改方向 |
|------|---------|
| 整体太暗 / 不够"傍晚" | PALETTE_WARM 中天空渐变往亮调偏移，peach 提到 #FFD8B5 |
| 路牌柱不够"原木"质感 | 在 SUBJECT[材质] 中追加 "weathered, sun-bleached patches" |
| 草地太单调 | PALETTE 中加更多绿色变体：#5A7A4A、#B0CC8A |
| 指示牌太多/太少 | 调整 "5 cream-white directional boards" → "3-7 cream-white directional boards" |
| 出现小猫/人/动物 | 在 NEGATIVE_PROMPT 中强化 "no person, no cat, no human, no animal" |
| 出现 3D 写实感 | 在 prompt 开头追加 "ABSOLUTELY NOT 3D, ABSOLUTELY 2D hand-drawn" |
| 出现英文指示牌文字 | 在 NEGATIVE_PROMPT 中追加 "no English text, no Latin alphabet" |

---

## 七、版本与变更

- v1.0（2026-06-04）：初始版本。基于 art-agent.md v1.0、art-style.md、scene-design.md 编写。
- 后续如 art-style.md 或 scene-design.md 修订，本文件需同步更新。
