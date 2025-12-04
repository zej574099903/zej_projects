---
title: "Next.js 全栈进阶(2)：基于 NextAuth.js v5 的安全鉴权系统"
date: "2025-12-05"
category: "全栈开发"
tags: ["Next.js", "NextAuth", "Security", "Authentication"]
description: "实战记录：如何使用 NextAuth.js v5 (Auth.js) 为 Next.js App Router 项目添加管理员登录功能，并保护 API 路由不被未授权访问。"
---

在[上一篇文章](/posts/nextjs-fullstack-mongodb-integration)中，我们成功连接了 MongoDB。但现在面临一个严重的安全隐患：任何知道 API 地址的人都可以往我们的数据库里塞文章。

本文将介绍如何使用 NextAuth.js v5 为博客加上一把“安全锁”。

## 1. 技术选型：NextAuth.js v5 (Auth.js)

NextAuth.js 是 Next.js 生态中最流行的认证库。v5 版本（现已更名为 Auth.js）针对 App Router 做了深度优化，支持 Edge Runtime，配置也更加简洁。

为了保持简单，我选择了 **Credentials Provider**（用户名/密码）模式，并将管理员密码存储在环境变量中。

## 2. 安装与配置

### 2.1 安装依赖
```bash
npm install next-auth@beta
```

### 2.2 环境变量
在 `.env.local` 中添加两个关键变量：

```env
# 随机生成的加密密钥，用于加密 Session Token
AUTH_SECRET="你的随机长字符串"

# 自定义的管理员密码
ADMIN_PASSWORD="你的超强密码"
```

### 2.3 核心配置 (`src/auth.ts`)

在项目根目录创建 `src/auth.ts`：

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // 简单的密码比对
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          // 验证成功，返回管理员用户对象
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login', // 自定义登录页路径
  },
});
```

### 2.4 创建 API 路由

在 `src/app/api/auth/[...nextauth]/route.ts` 中暴露认证接口：

```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

## 3. 实战：保护 API 路由

现在，我们可以去修改写文章的接口 (`POST /api/posts`)，加上权限检查逻辑。

```typescript
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. 获取当前 Session
  const session = await auth();
  
  // 2. 如果未登录，直接拒绝
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // 3. 已登录，继续执行数据库写入逻辑...
  // await dbConnect();
  // ...
}
```

## 4. 总结

通过这几步简单的配置，我们成功实现了：
1.  基于环境变量的密码验证。
2.  服务器端的 Session 管理。
3.  API 路由的权限保护。

现在，我的后端已经安全了。在下一篇文章中，我将利用这个安全的基础，构建一个炫酷的**后台管理系统 (Admin Dashboard)**。
