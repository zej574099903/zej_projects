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

## 3. 扩展功能：简历与项目集

博客不仅仅是写文章的地方，更是展示个人能力的窗口。因此我增加了两个独立模块：

### 个人简历 (Resume)
我设计了一个独立的 `/resume` 页面，采用左右分栏布局，展示我的技能清单、工作经历和教育背景。为了增强交互性，我在工作经历中嵌入了时间轴，并与项目集进行了关联。

### 项目展示 (Projects)
为了更好地展示我的作品，我复用了 Markdown 渲染管线，创建了 `content/projects` 目录。每个项目都有独立的详情页，包含演示链接、源码仓库地址和技术栈标签。

## 4. 体验优化：暗色模式

作为一个现代化的博客，Dark Mode 是必不可少的。我使用了 `next-themes` 来处理主题切换逻辑，并配合 Tailwind CSS 的 `dark:` 前缀来实现样式适配。

```tsx
// src/components/mode-toggle.tsx
export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  // ...
}
```

最棒的是 Tailwind Typography 插件支持 `dark:prose-invert`，这让我的 Markdown 文章在深色模式下能自动反转颜色，阅读体验极佳。

## 5. 总结

从初始化项目到最终上线，这个过程让我对 Next.js App Router 有了更深的理解。前端开发的乐趣就在于此：你所想的，都能通过代码变成现实。

如果你对我是如何把这个博客部署到 Vercel 感兴趣，请查看我的下一篇文章：[《避坑指南：将 Next.js 子目录项目部署到 Vercel》](/posts/deploying-nextjs-to-vercel)。
