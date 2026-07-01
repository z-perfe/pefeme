# 如何添加一篇新文章

这个博客是纯静态页面，没有构建步骤，浏览器直接读取 `posts.json` 和 `posts/*.md`。添加一篇新文章需要三步：

## 1. 写文章内容

在 `posts/` 目录下新建一个 `.md` 文件，文件名就是文章的 `slug`（建议用英文/拼音短横线命名，例如 `wo-de-xin-wenzhang.md`）。

文件开头需要 YAML 风格的 frontmatter，格式参考已有文章（如 [posts/zhou-wu.md](posts/zhou-wu.md)）：

```markdown
---
title: "文章标题"
date: "2026-07-01"
description: "一句话简介，会显示在首页列表里"
category: ""
image: "images/wo-de-xin-wenzhang.jpg"
---

正文内容，支持 Markdown 语法（标题、加粗、分割线 `---` 等）。
```

## 2. 准备配图（可选）

如果 frontmatter 里写了 `image`，把对应图片放进 `images/` 目录，文件名与路径要一致。不需要配图的话，把 `image` 留空 `""` 即可。

## 3. 在 posts.json 中登记文章

打开 [posts.json](posts.json)，在数组开头（或任意位置）新增一条记录，字段要和 md 文件的 frontmatter 保持一致：

```json
{
  "slug": "wo-de-xin-wenzhang",
  "title": "文章标题",
  "date": "2026-07-01",
  "description": "一句话简介",
  "category": "",
  "image": "images/wo-de-xin-wenzhang.jpg"
}
```

- `slug` 必须和 `posts/` 里的文件名（不含 `.md`）完全一致，否则文章打开会 404。
- 首页按 `posts.json` 数组顺序展示，越靠前显示越靠前，通常把新文章放在数组最前面。

## 4. 本地预览

因为页面用 `fetch` 加载 `posts.json` 和 `.md` 文件，不能直接双击用 `file://` 打开，需要起一个本地静态服务器，例如：

```powershell
python -m http.server 8000
```

然后浏览器访问 `http://localhost:8000/index.html` 查看首页，或 `http://localhost:8000/post.html?slug=你的slug` 查看单篇文章。
