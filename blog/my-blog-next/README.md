这是一个使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 初始化创建的 [Next.js](https://nextjs.org) 项目。

## 快速开始

首先，运行开发服务器：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以通过修改 `src/app/page.tsx` 来开始编辑页面。页面会在你保存文件时自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 [Geist](https://vercel.com/font) 字体（Vercel 推出的新字体系列）。

## 项目结构

本项目采用 `src` 目录结构以便于更好的组织代码。

```text
my-blog-next/
├── content/             # Markdown/MDX 博客文章
├── public/              # 静态资源（图片、图标等）
├── src/                 # 主要源代码
│   ├── app/             # Next.js App Router 页面和布局
│   │   ├── about/       # 示例功能模块（包含同位样式）
│   │   ├── api/         # [计划中] 后端 API 路由 (MongoDB)
│   │   ├── admin/       # [计划中] 后台管理页面
│   │   ├── globals.css  # 全局样式 (Tailwind)
│   │   ├── layout.tsx   # 根布局
│   │   └── page.tsx     # 首页
│   ├── components/      # 可复用的 React 组件
│   ├── lib/             # 工具函数和数据获取逻辑
│   │   └── db.ts        # [计划中] 数据库连接实例
│   ├── models/          # [计划中] Mongoose 数据模型 (Schema)
│   ├── types/           # TypeScript 类型定义
│   ├── styles/          # 共享样式
│   └── constants/       # 配置常量
├── next.config.ts       # Next.js 配置
├── package.json         # 项目依赖和脚本
└── tsconfig.json        # TypeScript 配置
```

## 🚀 全栈开发路线图 (Roadmap)

本项目正从纯静态 Markdown 博客向 **Next.js 全栈博客** 转型。以下是开发规划：

### Phase 1: 数据库集成与后端基础
- [ ] **MongoDB 环境准备**
  - 注册 MongoDB Atlas (云数据库)。
  - 获取连接字符串 (URI)。
- [ ] **项目配置**
  - 安装 `mongoose`。
  - 配置环境变量 `.env.local`。
  - 创建 `src/lib/db.ts` 实现单例数据库连接。
- [ ] **数据建模**
  - 创建 `src/models/Post.ts` (文章模型)。
  - 创建 `src/models/User.ts` (管理员用户模型)。

### Phase 2: 后端 API 开发 (Next.js API Routes)
利用 Next.js 的 Route Handlers (`src/app/api/...`) 开发后端接口：
- [ ] **文章管理 API**
  - `GET /api/posts`: 获取文章列表。
  - `GET /api/posts/[id]`: 获取单篇文章。
  - `POST /api/posts`: 新增文章 (需要鉴权)。
  - `PUT /api/posts/[id]`: 修改文章 (需要鉴权)。
  - `DELETE /api/posts/[id]`: 删除文章 (需要鉴权)。
- [ ] **认证 API**
  - `POST /api/auth/login`: 管理员登录。
  - 集成 `NextAuth.js` (Auth.js) 处理 Session。

### Phase 3: 后台管理系统 (Admin Dashboard)
在 `src/app/admin` 路径下构建管理界面：
- [ ] **登录页 (`/admin/login`)**
- [ ] **文章列表管理 (`/admin/posts`)**
  - 表格展示。
  - 增删改查操作入口。
- [ ] **文章编辑器 (`/admin/posts/new` & `[id]`)**
  - 集成 Markdown 编辑器或富文本编辑器。

### Phase 4: 前台重构 (Hybrid Mode)
- [ ] 保留 Markdown 文件读取能力 (作为归档或静态数据源)。
- [ ] 新增从 MongoDB 读取文章的能力。
- [ ] 首页混合展示静态文件文章和数据库文章。

---

### 模块组织方式
对于页面特定的样式，我们采用了同位（Colocation）策略：
- `src/app/[route]/page.tsx`: 页面组件
- `src/app/[route]/[name].module.css`: 该页面的特定样式

全局样式通过 Tailwind CSS 在 `src/app/globals.css` 中统一管理。

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。

你可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎提供反馈和贡献！

## 部署到 Vercel

部署 Next.js 应用最简单的方法是使用 Next.js 创作者开发的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

### 子目录部署注意事项

如果本项目作为子目录存在于 Git 仓库中（例如 Monorepo 结构），在 Vercel 导入项目后，需要进行以下配置：

1.  进入项目 **Settings** -> **General**。
2.  将 **Root Directory** 设置为项目的实际路径（例如 `blog/my-blog-next`）。
3.  保存并重新部署。

查看我们的 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 以获取更多详细信息。
