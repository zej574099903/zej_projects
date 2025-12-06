---
title: "Next.js 全栈进阶(2)：混合数据源架构与 ISR 性能优化"
date: "2025-12-06"
category: "全栈开发"
tags: ["Next.js", "ISR", "Performance", "MongoDB"]
description: "记录本博客从纯静态向混合数据源架构迁移过程中的关键性能优化，包括增量静态再生 (ISR) 的配置和动态路由参数的完善。"
---

随着博客集成了 MongoDB 数据库，现在我们的文章来源有了两个：本地 Markdown 文件和远程数据库。这种"混合数据源"架构虽然灵活，但也带来了一些性能挑战和构建问题。本文记录了今天的两个核心优化点。

## 1. 问题背景

在接入 MongoDB 后，我们发现了一个问题：**新发布的数据库文章无法通过动态路由访问**。

原因在于 `generateStaticParams`（Next.js 13+ App Router 用于 SSG 的 API）只读取了本地文件目录，导致数据库里的文章 Slug 没有被包含在预渲染路径中。

此外，如果每次用户访问都去查数据库，响应速度会变慢，且数据库压力较大。我们需要一种既能保证速度，又能保证内容更新的策略。

## 2. 优化方案

### 2.1 混合数据源的静态路径生成

首先，我们需要修改 `src/lib/posts.ts` 中的 `getAllPostIds` 函数。原先它是同步读取文件系统的，现在我们需要让它**并行**查询本地文件和数据库。

**修改后的 `getAllPostIds`：**

```typescript
/**
 * 获取所有文章 ID 列表（用于 generateStaticParams）
 * 支持混合数据源：本地 Markdown + MongoDB
 */
export async function getAllPostIds() {
  // 1. 获取本地 Markdown 文章 ID
  let localIds: { params: { id: string } }[] = [];
  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    localIds = fileNames.map((fileName) => ({
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }));
  }

  // 2. 获取 MongoDB 文章 ID
  let dbIds: { params: { id: string } }[] = [];
  try {
    await dbConnect();
    // 只查询已发布的文章，只取 slug 字段
    const posts = await Post.find({ published: true }).select('slug').lean();
    
    dbIds = posts.map((post) => ({
      params: {
        id: post.slug,
      },
    }));
  } catch (error) {
    console.error('Failed to fetch post IDs from database:', error);
  }

  // 3. 合并返回
  return [...localIds, ...dbIds];
}
```

对应地，我们需要将 `app/posts/[id]/page.tsx` 中的 `generateStaticParams` 也改为异步调用：

```typescript
export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => path.params);
}
```

这样，无论是本地文件还是数据库里的文章，都会被 Next.js 识别并尝试构建。

### 2.2 开启 ISR (增量静态再生)

为了解决性能和实时性的矛盾，Next.js 提供了 **ISR (Incremental Static Regeneration)** 机制。

它的工作原理是：
1.  用户第一次访问页面时，Next.js 返回构建时生成的静态 HTML（秒开）。
2.  如果当前时间距离上次生成超过了 `revalidate` 设定的秒数，Next.js 会在后台悄悄重新请求数据、重新构建页面。
3.  构建完成后，下一次访问就会看到最新的内容。

我们在首页 (`page.tsx`)、文章列表页 (`posts/page.tsx`) 和详情页 (`posts/[id]/page.tsx`) 统一添加了如下配置：

```typescript
// 开启 ISR，缓存有效期为 3600 秒 (1小时)
export const revalidate = 3600;
```

这意味着我们的博客既拥有静态网站的速度，又拥有每小时自动更新数据的能力，完美平衡了性能与灵活性。

## 3. 总结

通过这次优化，我们的博客架构变得更加健壮：

1.  **数据完整性**：动态路由现在能正确识别数据库中的文章。
2.  **高性能**：利用 ISR 机制，绝大多数用户访问都是命中静态缓存，数据库压力极小。
3.  **容错性**：即使数据库偶尔连接失败，由于有静态缓存存在，用户依然可以看到旧版本的页面，而不会看到错误页。

