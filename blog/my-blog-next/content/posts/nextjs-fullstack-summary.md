---
title: "Next.js 全栈开发实战总结：从零打造极客风 CMS"
date: "2025-12-07"
category: "全栈开发"
tags: ["Next.js", "MongoDB", "NextAuth", "CMS", "Summary"]
description: "回顾从零构建一个基于 Next.js + MongoDB 的全栈博客系统的全过程，涵盖了数据库集成、安全鉴权、Hybrid 数据架构以及极客风后台管理系统的实现。"
---

经过几天的密集开发，我的个人博客终于从一个静态站点进化为了一个功能完备的全栈 CMS 系统。本文将复盘整个开发过程中的关键技术点和架构决策。

## 1. 项目概览

这个项目的目标是构建一个**既有静态博客的轻量，又有动态系统的强大**的现代化博客平台。

### 核心技术栈
- **框架**: Next.js 15+ (App Router)
- **数据库**: MongoDB Atlas (Mongoose ODM)
- **鉴权**: NextAuth.js v5 (Auth.js)
- **样式**: Tailwind CSS + Framer Motion
- **语言**: TypeScript

## 2. 核心功能模块

### 2.1 混合数据架构 (Hybrid Data)
这是系统的核心亮点。为了保留 Markdown 文件管理的便利性，同时引入数据库的动态能力，我设计了一套混合数据获取逻辑：
- **读取**: 在服务端并行读取本地 `.md` 文件和 MongoDB 数据库文章。
- **合并**: 将两端数据标准化后合并，按日期倒序排列。
- **优势**: 我可以继续用 VSCode 写长文推送到 GitHub，也可以在手机上通过后台快速发布动态。

### 2.2 安全鉴权系统
安全是全栈应用的基石。我集成了 **NextAuth.js v5**，采用了最简单的 Credentials 模式配合环境变量 (`ADMIN_PASSWORD`)。
- **API 保护**: 在 `POST/PUT/DELETE` 路由中强制检查 Session。
- **后台保护**: `/admin` 路由组下的页面在服务端进行会话验证，未登录自动跳转。

### 2.3 极客风后台管理 (Admin Dashboard)
我没有使用现成的 CMS 模板，而是手搓了一套 UI：
- **登录页**: 使用 Glassmorphism (毛玻璃) + CSS 动画，打造科技感。
- **文章管理**: 支持文章的 CRUD 操作，快速切换发布/草稿状态。
- **编辑器**: 开发了一个双栏 Markdown 编辑器，左侧写作，右侧实时预览，支持自动 Slug 生成。

## 3. 遇到的挑战与坑

1.  **MongoDB 连接数爆炸**: 在 Next.js 开发模式下，热重载会导致数据库连接数激增。解决方案是实现 `dbConnect` 单例模式，复用全局连接。
2.  **Next.js 缓存机制**: App Router 的缓存非常激进。在后台更新文章后，必须调用 `revalidatePath` 或 `router.refresh()` 才能让前台看到最新数据。
3.  **Server vs Client**: 在构建编辑器时，需要频繁交互（输入、预览），必须使用 Client Component；而在获取数据列表时，Server Component 更加高效。合理划分边界至关重要。

## 4. 未来规划

虽然 V1.0 版本已经完成，但还有很多有趣的功能可以探索：
- **图片上传**: 目前只能用图床链接，下一步可以集成 AWS S3 或 Vercel Blob。
- **评论系统**: 集成 Giscus 或自建评论系统。
- **AI 辅助**: 在编辑器里集成 AI，辅助写作或生成摘要。

## 5. 结语

这次重构让我深刻体会到了 Next.js App Router 在全栈开发上的强大统治力。它让前端开发者能够以极低的门槛编写后端逻辑，真正实现了“一人全栈”。

如果你也想搭建这样的博客，欢迎参考我的开源代码。
