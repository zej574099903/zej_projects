---
title: "从零开始：使用 Next.js 打造我的个人博客"
date: "2025-12-03"
tags: ["Next.js", "React", "教程", "前端架构"]
description: "详细记录了我如何一步步搭建这个博客系统的过程，包括目录结构优化、MDX 渲染管线搭建以及组件化开发的设计思路。"
---

作为一名各种折腾的前端开发者，拥有一个完全可控的个人博客一直是我的心愿。虽然市面上有很多成熟的博客平台，但自己动手搭建不仅能满足定制化需求，更是一次梳理技术栈的好机会。

本文将详细记录我构建这个博客的全过程。

## 1. 起步与思考

项目初始化使用了标准的 `create-next-app`：

```bash
npx create-next-app@latest my-blog-next --typescript --tailwind --eslint
```

但在开始写代码之前，我首先思考的是**目录结构**。Next.js App Router 默认将 `app` 放在根目录下，但随着项目复杂度增加（特别是还要存放 content、工具库、组件），根目录会变得非常杂乱。

### 目录结构优化

我决定采用 `src` 目录结构，并将不同类型的资源进行严格分层：

```text
my-blog-next/
├── content/             # 存放 Markdown 数据源（文章、项目经历）
├── public/              # 静态资源
├── src/                 # 源码主目录
│   ├── app/             # 路由与页面
│   ├── components/      # UI 组件
│   ├── lib/             # 核心逻辑（如 Markdown 解析）
│   └── styles/          # 全局样式
```

特别是对于页面模块，我采用了 **Colocation（同位）** 策略：将页面组件 `page.tsx` 和它专属的 `module.css` 放在同一个文件夹下，这样维护起来非常舒服。

## 2. 核心功能实现：Markdown 博客系统

博客的核心是将 Markdown 文件转换为网页。我没有选择复杂的 CMS，而是选择了更轻量、更极客的文件系统方案。

### 技术栈选择

- **Gray-matter**: 解析 Markdown 顶部的 Frontmatter（标题、日期、标签等元数据）。
- **Remark & Remark-html**: 将 Markdown 文本转换为 HTML。
- **Tailwind Typography**: 一键美化文章排版，不用自己写几百行 CSS 来处理 `h1`、`p`、`ul` 的样式。

### 数据获取流程

我编写了一个工具函数 `src/lib/posts.ts`，它的工作流程如下：

1.  扫描 `content/posts` 目录下的所有 `.md` 文件。
2.  读取文件内容，提取 metadata 用于首页列表展示。
3.  针对单篇文章详情页，将 Markdown 内容编译为 HTML。

```typescript
// src/lib/posts.ts 核心代码片段
export function getSortedPostsData() {
  // ...读取文件并排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}
```

## 3. 界面与交互

### 统一布局 (Layout)

为了保证全站体验一致，我构建了全局的 `RootLayout`，包含：
- **Header**: 顶部导航，支持响应式。
- **Footer**: 底部版权信息。
- **Main**: 内容区域，使用 `flex-1` 确保内容不足时 Footer 依然沉底。

### 详情页渲染

文章详情页使用了动态路由 `src/app/posts/[id]/page.tsx`。最让我满意的是使用了 `dangerouslySetInnerHTML` 配合 Tailwind 的 `prose` 插件，只用一行代码就实现了完美的排版：

```tsx
<div 
  className="prose prose-lg prose-slate max-w-none dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
/>
```

## 4. 未来规划

目前的博客只是一个开始，接下来我计划完成以下模块：

1.  **个人简历页 (Resume)**：一个独立的交互式页面，展示我的个人信息。
2.  **项目集 (Projects)**：展示我做过的有趣项目，并支持筛选。
3.  **暗色模式**：适配系统主题。

前端开发的乐趣就在于此：你所想的，都能通过代码变成现实。欢迎持续关注！
