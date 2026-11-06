# 宝谱 · 标志文件

所有文字已转成矢量路径（path），不依赖任何字体；可以直接放进 Illustrator / Figma / InDesign，也可以当 `<img>` 用。

| 文件 | 用途 |
|---|---|
| `baopu-logo.svg` | 主标志，透明底，墨色 + 金色，适合浅色背景 |
| `baopu-logo-paper.svg` | 主标志，带纸色底 `#F7F2E9`，直接当图片用 |
| `baopu-logo-light.svg` | 深色背景版：纸白字 + 浅金，适合墨色/照片底 |
| `baopu-logo-mono.svg` | 单色版，全部墨色，适合印章、压印、单色印刷 |
| `baopu-mark.svg` | 只要「宝谱」二字的字标，不含英文 |
| `baopu-icon.svg` | 宝石图标，透明底，100×100 |
| `baopu-icon-tile.svg` | 宝石图标 + 纸色圆角底，适合头像/APP 图标 |
| `baopu-icon-light.svg` | 宝石图标深色背景版 |
| `favicon.svg` / `favicon-32.png` / `app-icon-180.png` | 站点图标三件套 |
| `preview.png` | 四种版本的效果预览 |

## 颜色

- 墨 `#211C17`
- 金 `#8A6331`（深色背景版用 `#D8B98A`）
- 纸 `#F7F2E9`

## 规格

- 主标志画布 `402 × 181`，中文 110px，英文 15px，字距分别为 0.16em / 0.30em
- 图标画布 `100 × 100`：外框 4px、内线 2px，与站点 favicon 完全同源
- 字标画布 `290 × 147`
- 中文字体：宋体-简 粗体（Songti SC Bold）；英文：Georgia
- 所有 glyph 已转曲，文件内只有 `<path>`，没有 `<text>`

## 重新生成

```bash
python3 make_logo.py
```

脚本会从系统字体读取字形并转成路径，只依赖 `fonttools`。
