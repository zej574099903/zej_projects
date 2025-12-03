---
title: "博客装修记：使用 Rehype Pretty Code 实现极致代码高亮"
date: "2025-12-03"
tags: ["Next.js", "Syntax Highlighting", "TailwindCSS", "Rehype"]
description: "一个没有代码高亮的技术博客是没有灵魂的。本文记录了我如何从 remark-html 迁移到 unified 管线，并使用 Rehype Pretty Code 实现类似 VS Code 的代码渲染效果，以及中间遇到的 Tailwind CSS 4.0 语法大坑。"
---

作为一个技术博客，代码块的阅读体验直接决定了文章的质量。之前我的博客只使用了基础的 Markdown 渲染，代码块是黑底白字，毫无美感可言。

今天，我终于把**代码高亮 (Syntax Highlighting)** 功能加上了。现在的效果就像你在 VS Code 里看代码一样舒服。

## 为什么选择 Rehype Pretty Code？

在 Next.js 生态中，实现代码高亮通常有几种方案：

1.  **Prism.js / Highlight.js**: 传统的客户端渲染方案。缺点是需要加载额外的 JS 脚本，且在页面加载时会有"闪烁"（FOUC）。
2.  **Rehype Pretty Code**: 基于 **Shiki** 的构建时（Build-time）渲染方案。

我选择了后者，因为：
*   **0 Runtime JS**: 高亮逻辑在构建时完成，生成的 HTML 自带样式，浏览器不需要运行任何 JS。
*   **VS Code 主题**: 它底层使用 Shiki，可以直接使用 VS Code 的 JSON 主题（如 GitHub Dark）。
*   **功能强大**: 支持行号、高亮特定行、文件名显示等高级功能。

## 实施步骤

### 1. 升级渲染管线

由于 `rehype-pretty-code` 是一个 Rehype 插件，我们需要将原本简单的 `remark().use(html)` 升级为完整的 **Unified** 管线：

Markdown AST (`remark-parse`) -> HTML AST (`remark-rehype`) -> 处理 HTML AST (`rehype-pretty-code`) -> 生成 HTML 字符串 (`rehype-stringify`)。

```typescript
// src/lib/posts.ts

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

// ...

const processedContent = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: 'github-dark',
    keepBackground: true, // 保留主题背景色
  })
  .use(rehypeStringify)
  .process(matterResult.content);
```

### 2. 处理样式冲突

默认情况下，`@tailwindcss/typography` 插件（即 `prose` 类）会给 `pre` 和 `code` 加上它自己的默认样式（比如讨厌的反引号），这会破坏我们的高亮效果。

我们需要在全局 CSS 中覆盖它：

```css
/* src/app/globals.css */

/* 强制覆盖 Tailwind Typography 的默认代码块样式 */
.prose pre {
  @apply p-0 m-0 rounded-lg overflow-hidden !bg-[#0d1117];
}

.prose code {
  @apply bg-transparent p-0 text-inherit font-normal after:content-none before:content-none;
}
```

## 遇到的坑（踩坑实录）

### 1. Tailwind CSS 4.0 的 !important 写法变了

在配置全局样式时，我想强制覆盖背景色，习惯性地写了：

```css
/* ❌ 错误写法 */
@apply bg-[#0d1117] !important;
```

结果直接导致 Build 失败，报错 `Cannot apply unknown utility class !important`。

经过排查发现，在 Tailwind CSS 4.0 (以及使用了新的 PostCSS 解析器时)，`!important` 不能直接跟在 `@apply` 后面。正确的写法是将感叹号放在类名**前面**：

```css
/* ✅ 正确写法 */
@apply !bg-[#0d1117];
```

### 2. Unified 插件的 TypeScript 类型地狱

Unified 生态的插件类型定义非常严格且复杂。直接使用 `.use(rehypePrettyCode)` 有时会报类型不匹配的错误。

虽然这次我很幸运，最终 IDE 识别出了类型，但在开发过程中，如果遇到类型报错但代码能跑的情况，可以使用 `// @ts-expect-error` 暂时绕过，或者检查 `@types/` 包是否安装完整。

## 总结

经过一番折腾，现在博客的代码块终于有了质的飞跃。不仅好看，而且性能极佳。

如果你也在用 Next.js 写博客，强烈推荐你也试试 `rehype-pretty-code`。
