---
title: "Next.js 全栈进阶(3)：打造极客风 Markdown 后台管理系统"
date: "2025-12-06"
category: "全栈开发"
tags: ["Next.js", "Admin Dashboard", "Tailwind CSS", "Markdown"]
description: "不使用现成的 UI 库，完全手搓一个炫酷的 Glassmorphism 风格后台管理系统。包含双栏 Markdown 编辑器、实时预览、自动 Slug 生成以及 Hybrid 数据展示。"
---

有了[数据库](/posts/nextjs-fullstack-mongodb-integration)和[安全鉴权](/posts/nextjs-secure-authentication-nextauth)之后，最后一块拼图就是：**后台管理界面 (Admin Dashboard)**。

我不喜欢那种千篇一律的 Admin 模板，作为一个极客，我决定手搓一套 UI。

## 1. 炫酷的 Glassmorphism 登录页

对于 `/admin/login` 页面，我采用了 **毛玻璃 (Glassmorphism)** 设计风格，并配合 CSS 动画。

### 核心技术点
- **CSS Keyframes**: 实现了背景中三个彩色圆球的流动动画 (`animate-blob`)。
- **Tailwind CSS**: 使用 `backdrop-blur-xl` 和 `bg-white/5` 实现磨砂玻璃质感。
- **Framer Motion**: 给登录框加上了入场动画。

```tsx
// 登录框的部分代码
<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
  {/* ... */}
</div>
```

## 2. 双栏 Markdown 编辑器

为了获得最佳的写作体验，我构建了一个 `/admin/posts/new` 页面，采用经典的左右分栏布局：

- **左侧 (Editor)**: 纯文本输入区，使用 `textarea`。
- **右侧 (Preview)**: 使用 `react-markdown` 实现的实时预览区。
- **顶部**: 实现了标题输入自动生成 URL Slug 的功能 (例如输入 "Hello World" -> `hello-world`)。

这个编辑器直接集成了我们的 `POST /api/posts` 接口。当点击“发布”按钮时，前端会发送一个带鉴权 Cookie 的请求，将文章存入 MongoDB。

## 3. Hybrid Mode：混合数据展示

这是我最自豪的功能。我的博客前台并不是只显示数据库里的文章，而是实现了 **Hybrid（混合）** 模式：

1.  **本地 Markdown**: 扫描 `content/posts` 目录。
2.  **云端数据库**: 查询 MongoDB Atlas。
3.  **合并展示**: 将两者合并，按日期倒序排列。

这意味着我可以随时在 VSCode 里写一篇复杂的长文 push 上去，也可以在手机上通过 Admin 后台快速发布一篇短文。

```typescript
// src/lib/posts.ts 伪代码
export async function getSortedPostsData() {
  const localPosts = getLocalMarkdownPosts();
  const dbPosts = await getMongoPosts();
  return [...localPosts, ...dbPosts].sort(byDate);
}
```

## 4. 全屏布局优化

为了让后台管理系统看起来更开阔，我修改了全局布局 `layout.tsx`，移除了原本限制宽度的 `max-w-4xl` 容器，改为全宽展示。

## 5. 最终成果

至此，我的博客已经成功进化为一个功能完备的 CMS 系统：
- ✅ **全栈架构**: Next.js + MongoDB
- ✅ **安全保护**: NextAuth.js 鉴权
- ✅ **极客后台**: 炫酷 UI + Markdown 编辑器
- ✅ **混合存储**: 本地文件 + 云端数据共存

这就是我理想中的个人博客形态：既有静态博客的轻量与可控，又有动态系统的灵活与强大。
