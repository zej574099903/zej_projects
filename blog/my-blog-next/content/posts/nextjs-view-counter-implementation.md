---
title: "Next.js 全栈进阶(3)：从零实现文章阅读量统计系统"
date: "2025-12-06"
category: "全栈开发"
tags: ["Next.js", "MongoDB", "React Hooks", "API Design"]
description: "详细记录了如何在 Next.js + MongoDB 架构中实现文章阅读量统计功能。涵盖了后端 API 设计、Mongoose 模型优化、前端组件封装以及如何处理本地/数据库混合数据源的挑战。"
---

阅读量（View Count）是博客系统中最基础但也最能带来正向反馈的功能之一。

在上一篇文章中，我们解决了混合数据源的路由渲染问题。今天，我们将基于 MongoDB 和 Next.js API Route，为每篇文章加上实时的阅读量统计，**即使是本地的 Markdown 文章也能拥有云端数据**。

## 1. 设计思路

我们的博客有两种文章来源：
1.  **数据库文章**：本身就在 MongoDB 里，加一个 `views` 字段轻而易举。
2.  **本地 Markdown**：没有数据库记录。

为了统一处理，我们采取**"懒加载占位"**策略：
当用户访问一篇本地文章时，API 会尝试在数据库查找；如果找不到，就自动创建一个只有 `slug` 和 `views` 的"占位记录"。这样我们就不需要手动迁移本地文章，也能统计它们的阅读量了。

## 2. 后端实现

### 2.1 修改数据模型

首先在 `src/models/Post.ts` 中增加 `views` 字段。

这里有一个 Next.js 开发环境下的常见坑：**Mongoose 模型缓存**。由于 Next.js 的热重载机制，修改 Schema 后如果不清除缓存，新字段往往不生效。

```typescript
// src/models/Post.ts

const PostSchema = new Schema<IPostDocument>({
  // ...其他字段
  views: {
    type: Number,
    default: 0,
  },
  // ...
});

// 关键优化：开发环境下强制删除模型缓存，确保 Schema 修改实时生效
if (process.env.NODE_ENV === 'development' && mongoose.models.Post) {
  delete mongoose.models.Post;
}

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
```

### 2.2 实现 API 接口

创建 `src/app/api/views/route.ts`，支持 `GET`（查询）和 `POST`（增加）。

核心逻辑在 `POST` 方法中，我们使用了 `findOneAndUpdate` 的原子操作来保证并发安全，并处理了"占位记录"的创建逻辑。

```typescript
// src/app/api/views/route.ts

export async function POST(request: Request) {
  const { slug } = await request.json();
  await dbConnect();

  // 尝试查找并原子性地 +1
  const post = await Post.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!post) {
    // 如果没找到（说明是本地文章），创建占位记录
    const newPost = await Post.create({
      slug,
      title: `Local Post: ${slug}`,
      content: 'Placeholder for views tracking',
      published: false, // 标记为未发布，不影响文章列表
      views: 1,
    });
    return NextResponse.json({ views: newPost.views });
  }

  return NextResponse.json({ views: post.views });
}
```

## 3. 前端组件封装

为了让页面代码保持整洁，我们封装了一个智能的 `ViewCounter` 组件。它负责：
1.  组件挂载时自动调用 API 增加阅读量。
2.  显示传入的初始值（SSG 时的快照），并在 API 返回后更新为最新值。
3.  处理并发请求取消（AbortController）。

```typescript
// src/components/view-counter.tsx
'use client';

export const ViewCounter = ({ slug, initialViews = 0 }: Props) => {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    const controller = new AbortController();

    const updateViews = async () => {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          body: JSON.stringify({ slug }),
          signal: controller.signal,
        });
        const data = await res.json();
        setViews(data.views);
      } catch (e) {
        // 处理错误
      }
    };

    updateViews();
    return () => controller.abort();
  }, [slug]);

  return (
    <span className="flex items-center gap-1 text-sm text-gray-500">
      <Eye className="w-4 h-4" />
      <span>{views > 0 ? views.toLocaleString() : '...'}</span>
    </span>
  );
};
```

## 4. 效果与总结

将组件集成到文章详情页后，现在无论是从 CMS 发布的文章，还是本地 Git 管理的 Markdown 文件，只要有人访问，数据库里就会自动记录并累加阅读数。

这个功能的实现展示了全栈开发的魅力：通过打通前后端，我们弥补了纯静态博客在动态交互上的短板，同时又保留了静态生成的性能优势（ISR）。

