---
title: "Next.js 全栈进阶(1)：MongoDB Atlas 数据库集成指南"
date: "2025-12-04"
category: "全栈开发"
tags: ["Next.js", "MongoDB", "Mongoose", "Database"]
description: "详细记录了如何在 Next.js 项目中集成 MongoDB Atlas 云数据库，包括账号注册、IP 白名单配置、环境变量设置以及 Mongoose 单例模式的最佳实践。"
---

本文记录了我将博客从纯静态 Markdown 转型为 Next.js + MongoDB 全栈应用的的第一步：数据库集成。

## 1. 为什么要使用 MongoDB Atlas？

在 Vercel 这种 Serverless 环境下，部署传统的 MySQL 或 MongoDB 实例比较麻烦（需要买服务器）。而 MongoDB Atlas 提供了官方托管的云数据库服务，有免费层（Shared Cluster），且支持 Serverless 连接模式，非常适合个人全栈项目。

## 2. 详细操作步骤

### 2.1 注册与集群创建
1.  访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 并注册账号。
2.  创建一个 **Shared Cluster** (免费版)。
3.  云服务商选择 AWS 或 Azure 的临近节点（如香港或新加坡，速度相对快些）。

### 2.2 关键配置（踩坑点）

在创建完集群后，有两步至关重要的安全设置，如果漏了会导致连接超时：

#### 创建数据库用户 (Database User)
1.  进入 **Security** -> **Database Access**。
2.  点击 `Add New Database User`。
3.  设置用户名和密码（**务必记下来！**）。
4.  权限选择 `Read and write to any database`。

> **注意**：如果你忘记密码，可以在这里点击 Edit -> Edit Password 重置。

#### 设置网络访问 (Network Access)
这是最容易忽略的一步。默认情况下，MongoDB 只允许特定 IP 访问。
1.  进入 **Security** -> **Network Access**。
2.  点击 `Add IP Address`。
3.  选择 **Allow Access From Anywhere** (`0.0.0.0/0`)。
    *   原因：Vercel 的构建服务器和运行环境 IP 是动态的，无法指定固定 IP。

### 2.3 获取连接字符串
1.  回到 **Database** -> **Connect** -> **Drivers**。
2.  复制连接字符串：`mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`。

## 3. Next.js 项目配置

### 3.1 安装依赖
```bash
npm install mongoose
```

### 3.2 环境变量
在项目根目录创建 `.env.local` 文件：

```env
# 记得替换 <password> 为真实密码，并指定数据库名（如 /my-blog）
MONGODB_URI=mongodb+srv://admin:mypassword@cluster0.xxxxx.mongodb.net/my-blog?retryWrites=true&w=majority
```

### 3.3 编写数据库连接工具 (Singleton Pattern)

在 Next.js 开发环境下（Hot Reload），如果直接调用 `mongoose.connect`，每次修改代码都会重新建立连接，导致数据库连接数瞬间爆炸。

我们需要实现一个单例模式来缓存连接。创建 `src/lib/db.ts`：

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// 全局缓存接口定义
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// 检查全局对象中是否已有缓存
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    // 建立连接并缓存 promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### 3.4 定义数据模型 (Schema)

为了让 TypeScript 和 MongoDB 完美配合，我们在 `src/models/Post.ts` 中定义了文章模型：

```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost {
  title: string;
  slug: string;
  content: string;
  published: boolean;
  // ...其他字段
}

const PostSchema = new Schema<IPostDocument>({
  // ...Schema 定义
}, { timestamps: true });

// 避免重复编译模型
const Post: Model<IPostDocument> = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
```

## 4. 总结

至此，我们已经完成了数据库的基础设施建设。下一步，我们将利用 Next.js 的 API Routes (Route Handlers) 来实现文章的增删改查接口。
