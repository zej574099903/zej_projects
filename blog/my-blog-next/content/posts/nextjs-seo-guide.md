---
title: "Next.js 博客 SEO 实战指南：从 Sitemap 到 Open Graph"
date: "2025-12-03"
tags: ["Next.js", "SEO", "Sitemap", "Open Graph"]
description: "酒香也怕巷子深。为了让我的博客能被更多人看到，我对其进行了全面的 SEO 优化。本文详细介绍了如何在 Next.js App Router 中配置 Metadata、生成 Sitemap 和 Robots.txt。"
---

博客搭建好了，如果没有人看，那就成了自言自语。为了让搜索引擎（和潜在的读者）更容易找到我的内容，SEO（搜索引擎优化）是必不可少的一环。

Next.js 15 的 App Router 提供了一套非常强大的 SEO API，让这一切变得异常简单。

## 1. Metadata API：定义网页的灵魂

在 `layout.tsx` 或 `page.tsx` 中导出 `metadata` 对象，是 Next.js 中定义 SEO 信息的标准方式。

### 基础配置

首先，在根布局中定义全局的 Metadata：

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Liora Blog',
    template: '%s | Liora Blog', // 这样子页面的标题就会自动变成 "文章标题 | Liora Blog"
  },
  description: 'A personal blog about frontend development.',
  openGraph: {
    // ... 配置 OG 协议，让分享卡片更好看
  }
};
```

### 动态 Metadata

对于博客文章页，我们需要根据文章内容动态生成标题和描述：

```typescript
// src/app/posts/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostData(params.id);
  return {
    title: post.title,
    description: post.description,
  };
}
```

## 2. Sitemap：给爬虫的地图

Sitemap 是告诉搜索引擎"我有这些页面，快来爬"的文件。在 Next.js 中，只需要创建一个 `sitemap.ts` 文件即可。

```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const blogUrls = posts.map((post) => ({
    url: `https://your-domain.com/posts/${post.id}`,
    lastModified: post.date,
  }));

  return [
    { url: 'https://your-domain.com', lastModified: new Date() },
    ...blogUrls,
  ];
}
```

构建时，Next.js 会自动生成 `sitemap.xml`。

## 3. Robots.txt：爬虫协议

同样，创建 `src/app/robots.ts` 来告诉爬虫哪些可以爬，哪些不能爬。

```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  };
}
```

## 总结

通过这三步，我们已经完成了一个博客 90% 的 SEO 基础建设。

1.  **Metadata**: 让人类读懂你的网页。
2.  **Sitemap**: 让机器读懂你的结构。
3.  **Robots**: 制定规则。

接下来的工作，就是持续产出高质量的内容了。毕竟，**Content is King**。
