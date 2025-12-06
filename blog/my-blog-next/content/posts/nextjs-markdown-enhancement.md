---
title: "Next.js 全栈进阶(4)：打造极致的 Markdown 阅读体验"
date: "2025-12-06"
category: "全栈开发"
tags: ["Next.js", "Markdown", "Unified", "UX"]
description: "本篇记录了如何通过引入 remark-gfm、rehype-slug 等插件，让博客支持 GitHub 风格的表格、任务列表，并自动为标题生成锚点链接，大幅提升长文阅读体验。"
---


## 1. 目标功能

我们希望实现以下增强功能：
*   **GitHub Flavor Markdown (GFM)**：支持表格、删除线、任务列表、自动链接等。
*   **标题锚点**：自动给 h1-h6 标题生成 ID，并添加跳转链接，方便分享和目录跳转。

## 2. 安装依赖

我们需要引入 unified 生态的一系列插件：

```bash
npm install remark-gfm rehype-slug rehype-autolink-headings
```

*   `remark-gfm`: 让 remark 解析器支持 GFM 语法。
*   `rehype-slug`: 遍历 HTML AST，获取标题文本并生成 id（例如 `## Hello World` -> `<h2 id="hello-world">`）。
*   `rehype-autolink-headings`: 自动给有了 id 的标题添加 `<a>` 链接。

## 3. 配置 Unified 管道

修改 `src/lib/posts.ts`，将这些插件插入到处理链的正确位置。

**注意顺序非常重要**：
1.  `remark-parse`: 解析 Markdown
2.  **`remark-gfm`**: 处理 GFM 语法（需要在转 HTML 之前）
3.  `remark-rehype`: 转为 HTML AST
4.  **`rehype-slug`**: 生成 ID
5.  **`rehype-autolink-headings`**: 生成链接（必须在有 ID 之后）
6.  `rehype-pretty-code`: 代码高亮
7.  `rehype-stringify`: 输出 HTML

```typescript
// src/lib/posts.ts

// ...引入插件
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export async function getPostData(id: string) {
  // ...

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm) // <--- 1. 支持表格、任务列表
    .use(remarkRehype)
    .use(rehypeSlug) // <--- 2. 生成标题 ID
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // <--- 3. 标题变链接
    .use(rehypePrettyCode, {
       // ...
    })
    .use(rehypeStringify)
    .process(rawContent);

  // ...
}
```

## 4. 效果演示

现在我们的博客已经支持如下语法了：

### 表格 (Tables)

| 功能 | 状态 | 优先级 |
| :--- | :---: | ---: |
| GFM 支持 | ✅ | 高 |
| 标题锚点 | ✅ | 中 |
| 图片优化 | ⏳ | 低 |

### 任务列表 (Task Lists)

- [x] 安装 remark-gfm
- [x] 配置 rehype 插件
- [ ] 编写测试文章

### 删除线 (Strikethrough)

~~这是一段被删除的文字~~

---

这些看似微小的改进，能让技术文章的排版更加专业，尤其是表格功能，在对比参数或展示数据时非常有用。
