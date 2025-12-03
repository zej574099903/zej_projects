---
title: "给 Next.js 博客安个家：集成 Giscus 评论系统"
date: "2025-11-26"
category: "Engineering"
tags: ["Next.js", "Giscus", "GitHub Discussions", "React"]
description: "一个好的博客不仅是输出，更是交流。本文记录了我如何放弃笨重的 Disqus，选择轻量级、无广告且极客范十足的 Giscus 作为评论系统，并将其完美集成到 Next.js 15 中。"
---

博客上线后，我一直觉得少了点什么。虽然我可以写文章，但读者（如果有的话）没法反馈。对于技术博客来说，交流和指正往往比文章本身更有价值。

于是，我决定给博客加上评论功能。

## 选型：为什么是 Giscus？

在调研评论系统时，我主要考虑了以下几个方案：

1.  **Disqus**: 老牌霸主，但广告多、加载慢、UI 风格与我的极简博客格格不入。❌
2.  **Gitalk / Utterances**: 基于 GitHub Issues。思路不错，但 Issues 毕竟是用来追踪 Bug 的，用来存评论总觉得怪怪的（而且会污染 Issues 列表）。🤔
3.  **Giscus**: 基于 **GitHub Discussions**。✨

Giscus 简直是为开发者博客量身定做的：
*   **利用 GitHub Discussions**: 评论就是讨论，天然契合。
*   **无数据库**: 数据全在 GitHub 上，我不需要维护后端。
*   **无广告 & 免费**: 干净清爽。
*   **极客范**: 读者用 GitHub 账号登录，天然过滤了非技术用户（某种程度上）。

## 实施步骤

### 1. 准备工作

首先，你需要去 GitHub 仓库的 Settings 里开启 **Discussions** 功能。

然后，访问 [giscus.app](https://giscus.app/zh-CN)，按照指引配置你的仓库，它会自动生成一段脚本配置。你需要拿到关键的 `repoId` 和 `categoryId`。

### 2. 安装依赖

Giscus 官方提供了一个 React 组件，让集成变得异常简单：

```bash
npm install @giscus/react
```

### 3. 创建组件

我封装了一个 `Comments` 组件，支持自动跟随网站的主题（暗黑/亮色模式）：

```tsx
// src/components/comments.tsx
"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { theme } = useTheme();

  return (
    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
      <Giscus
        id="comments"
        repo="your-name/your-repo"
        repoId="R_kgDO..."
        category="Announcements"
        categoryId="DIC_kwDO..."
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'transparent_dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
```

### 4. 在文章页引入

最后，在 `src/app/posts/[id]/page.tsx` 的底部引入这个组件即可：

```tsx
// src/app/posts/[id]/page.tsx
import { Comments } from '@/components/comments';

export default async function Post({ params }: Props) {
  // ...
  return (
    <article>
      {/* 文章内容 */}
      <Comments />
    </article>
  );
}
```

## 遇到的坑（踩坑实录）

### 1. 依赖安装路径错误

在安装 `@giscus/react` 时，我直接在终端敲了 `npm install`。但我忘了我的 Next.js 项目是在一个**子目录** (`my-blog-next`) 里。

结果导致依赖装到了根目录的 `node_modules`，而不是项目目录里。运行项目时直接报错：
`Module not found: Can't resolve '@giscus/react'`。

**解决办法**：记得 `cd` 到项目目录再安装依赖，或者检查 `package.json` 是否在正确的位置。

### 2. TypeScript 类型报错

如果在引入组件时遇到类型报错，通常是因为 `@types` 包缺失或者没有重启 TS Server。不过 `@giscus/react` 自带了类型定义，只要安装正确，通常不会有问题。

## 效果

现在，你可以在本页面的底部看到评论框了。欢迎留下你的第一条评论！👇
