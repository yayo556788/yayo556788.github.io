---
title: 你好，世界
date: 2026-10-20 17:20:00
updated: 2026-10-20 17:20:00
description: 博客的第一篇文章，顺便记一下日常写作会用到的格式。
categories:
  - 随笔
tags:
  - Hexo
  - Butterfly
sticky: 100
---

这是博客的第一篇文章。它同时也是一份「格式备忘录」——以后写文章可以直接复制这里的写法。

<!-- more -->

## 标题与段落

正文用 Markdown 写。一级标题留给文章标题，正文从 `##` 开始，目录（TOC）会自动抓取 `##` 和 `###`。

## 代码块

```javascript
// 支持高亮、行号、语言标签和一键复制
const posts = await hexo.locals.get('posts');
posts.forEach((post) => {
  console.log(`${post.title} — ${post.date.format('YYYY-MM-DD')}`);
});
```

```bash
# 新建文章
npx hexo new "文章标题"
# 本地预览，默认 http://localhost:4000
npx hexo server
```

## 提示块

{% note info 'fas fa-lightbulb' %}
Butterfly 支持 `note` 标签，用来写提示、警告、注意事项，比纯文本醒目得多。
{% endnote %}

{% note warning 'fas fa-triangle-exclamation' %}
图片记得放进 `source/img/`，引用时写 `/img/文件名.png`，这样即使部署在子路径（项目仓库）也不会失效。
{% endnote %}

## 表格

| 操作 | 命令 | 说明 |
| --- | --- | --- |
| 新建文章 | `hexo new "标题"` | 生成到 `source/_posts/` |
| 本地预览 | `hexo server` | 改完刷新即可 |
| 生成静态文件 | `hexo generate` | 输出到 `public/` |
| 清理缓存 | `hexo clean` | 样式没生效时先清一次 |

## 交接给 CI

写完 `git push`，GitHub Actions 会自动构建并发布。剩下的时间，去写下一篇吧。
