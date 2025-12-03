---
title: "避坑指南：将 Next.js 子目录项目部署到 Vercel"
date: "2025-11-05"
tags: ["Vercel", "Deployment", "Monorepo", "Git"]
description: "当你的 Next.js 项目不是 Git 仓库的根目录时，部署到 Vercel 可能会遇到 404 错误。本文详细记录了如何解决这个问题。"
---

今天我在部署这个博客时遇到了一些波折，特此记录，希望能帮到遇到同样问题的朋友。

## 问题背景

我的 Git 仓库结构是一个 **Monorepo（多项目仓库）**，这意味着我把多个项目都放在同一个 Git 仓库里：

```text
zej_projects/ (Git 根目录)
├── blog/
│   └── my-blog-next/ (我的 Next.js 项目)
├── other-project/
└── README.md
```

当我直接在 Vercel 上导入 `zej_projects` 仓库部署时，构建虽然成功了，但访问页面却直接显示 `404 NOT_FOUND`。

## 根本原因

Vercel 默认认为你的 Git 仓库根目录就是 Next.js 项目的根目录。它会在根目录下寻找 `.next` 构建产物，但实际上我的构建产物在 `blog/my-blog-next/.next` 里，所以 Vercel 找不到文件，就报了 404。

## 解决方案

### 1. 修改 Vercel 项目配置

不需要修改代码，只需要调整 Vercel Dashboard 的设置：

1.  进入 Vercel 项目的 **Settings** -> **General**。
2.  找到 **Root Directory** 选项。
3.  点击 Edit，输入项目在仓库中的相对路径：`blog/my-blog-next`。
4.  保存设置。

### 2. 重新触发部署

修改设置后，之前的部署不会自动生效。需要去 **Deployments** 页面，找到最近的一次部署，点击 **Redeploy**。

### 3. 避坑：Submodule 问题

如果你的子目录里不小心包含了一个 `.git` 文件夹（比如你在子目录里运行过 `git init`），Git 会把它识别为 Submodule。Vercel 默认不会拉取 Submodule 的内容，导致目录为空。

**检查方法**：在 GitHub 网页上看，如果子文件夹是一个带箭头的图标且点不进去，那就是 Submodule。

**修复命令**：
```bash
# 删除子目录下的 .git
rm -rf blog/my-blog-next/.git

# 在根目录重新提交
git add .
git commit -m "Fix submodule issue"
git push
```

## 总结

部署 Monorepo 或者子目录项目时，关键在于告诉部署平台**“我的项目到底在哪儿”**。配置好 Root Directory，一切就迎刃而解了。
