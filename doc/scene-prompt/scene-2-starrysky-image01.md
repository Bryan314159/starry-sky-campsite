# 场景二 · 星空书签 — MiniMax image-01 直接复制版

> **目标模型**：`image-01`（MiniMax / 稀宇科技）
> **支持宽高比**：16:9（与新标签页视口最接近）
> **配套文档**：[scene-1-campsite.md](./scene-1-campsite.md) · [scene-1-campsite-image01.md](./scene-1-campsite-image01.md)
> **关联设计**：`doc/scene-design.md` §三·§四·§五、`doc/art-style.md` §5.2·§7.2、`doc/项目梗概.md` §场景二

---

## 一、英文 Prompt（1347 字符 ✅）

→ 完整内容见 [`scene-2-starrysky-image01-en.txt`](./scene-2-starrysky-image01-en.txt)

## 二、中文 Prompt（426 字符 ✅）

→ 完整内容见 [`scene-2-starrysky-image01-zh.txt`](./scene-2-starrysky-image01-zh.txt)

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

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `aspectRatio` | `16:9` | image-01 不支持 16:10；新标签页视口最接近 |
| `n` | 4 | 一次跑 4 张，挑 1 张构图最稳的 |
| `promptOptimizer` | `true`（默认） | 自动润色；如加料太多改 `false` |

---

## 四、与场景一 Prompt 的关键差异

| 维度 | 场景一（营地） | 场景二（星空） |
|------|--------------|--------------|
| 调色板 | `PALETTE_WARM` 暖色 | `PALETTE_COLD` 冷色 |
| 主体 | 路牌柱 + 5 块指示牌 | 满天星斗 + 小猫剪影 |
| 天空占比 | 35% | **75%** |
| 地面占比 | 65% | **25%** |
| 相机视角 | 略高、注视路牌 | **低位仰视**、注视星空 |
| 光照 | 暖金傍晚阳光 | 星光自发光，无方向光 |
| 氛围关键词 | 出发前的期待 | 仰望的敬畏感 |
| 诗意引用 | — | "醉里不知天在水，满船清梦压星河" |

> **关键设计点**：根据 `art-style.md` §5.2，**夜景不追求"黑"而是追求"深"**——深蓝到深紫的柔和渐变，星星的暖金光芒与深色天空形成冷暖对比。

---

## 五、调参指南（若首轮不满意）

| 问题 | 修改方向 |
|------|---------|
| 星空太"黑"（缺少层次） | 调高天空渐变中间色：`#2C3E5E` → `#3D4F70`，让"深"而非"黑" |
| 星星太亮 / 刺眼 | 在 STYLE 段强化 "soft star glow, no harsh light" |
| 星星太均匀 | 强化 "varying sizes, tiny pinpoints mixed with medium orbs and a few large glowing ones" |
| 没有小猫剪影 | 在主体段把 "small black cat silhouette" 加粗，模型可能忽略小细节 |
| 小猫太大抢戏 | 在主体段追加 "very small, tiny silhouette, 1/20 of frame" |
| 出现英文文字 | 在主体段追加 "no constellation labels, no English text, no Latin alphabet" |
| 出现 3D 写实感 | prompt 开头加 "STRICTLY 2D HAND-DRAWN, NOT 3D" |
| 想要更"诗意" | 把"星空"比喻相关词汇换成 "Milky Way" / "constellation" 提示 |

---

## 六、文件清单

| 文件 | 字符数 | 用途 |
|------|:------:|------|
| `scene-2-starrysky-image01-en.txt` | 1347 | 英文纯 prompt（直接复制） |
| `scene-2-starrysky-image01-zh.txt` | 426 | 中文纯 prompt（直接复制） |
| `scene-2-starrysky-image01.md` | — | 本文档（参数 + 差异表 + 调参指南） |

---

## 七、版本与变更

- v1.0（2026-06-05）：初始版本。基于 art-agent.md v1.0、art-style.md §5.2/§7.2、scene-design.md §五。
