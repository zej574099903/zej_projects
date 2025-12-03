---
title: "为 Next.js 博客添加 cmdk 全局搜索：打造极致交互体验"
date: "2025-12-03"
category: "Engineering"
tags: ["Next.js", "cmdk", "Search", "React", "UI/UX"]
description: "在这个信息过载的时代，一个高效的全局搜索功能是提升博客用户体验的关键。本文记录了我如何使用 cmdk 库实现 macOS Spotlight 风格的命令面板，并解决了 Radix UI 的可访问性报错等棘手问题。"
---

继代码高亮和评论系统之后，我决定为博客加上最后一块拼图：**全局搜索**。

虽然我的文章数量还不多，但在这个习惯了 `Cmd+K` 的时代，一个能够随时呼出、即时响应的命令面板（Command Palette）能极大地提升网站的"极客感"和专业度。

## 选型：为什么是 cmdk？

在 React 生态中，命令面板的组件库有不少，比如 `kbar`、`react-command-palette` 等。但我最终选择了 **cmdk**（由 Paco Coursey 开发）。

理由很简单：
*   **颜值即正义**：Vercel 的 Dashboard、Raycast 官网都在用它，设计风格非常现代。
*   **可组合性强**：它只提供 Headless 组件，样式完全由你决定（结合 Tailwind CSS 简直完美）。
*   **无障碍访问**：底层基于 Radix UI，天生支持屏幕阅读器和键盘导航。

## 实现步骤

### 1. 数据源准备

要在客户端实现"即时搜索"，最简单的办法是在服务端获取所有文章数据，然后传给客户端组件。

我在 `RootLayout` 中获取了所有文章数据，并将其传给了 `Header` 组件，最终传递给 `Search` 组件。

```tsx
// src/app/layout.tsx
const allPostsData = getSortedPostsData();
// ...
<Header posts={allPostsData} />
```

### 2. 创建 Search 组件

核心逻辑很简单：监听 `Cmd+K` 快捷键，控制一个 `open` 状态。

```tsx
// src/components/search.tsx
React.useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);
```

## 遇到的坑（踩坑实录）

### 1. Radix UI 的 DialogTitle 报错

这是最让我头秃的一个问题。当我第一次把 `Command.Dialog` 放进去时，控制台直接红了一片：
`DialogContent requires a DialogTitle for the component to be accessible for screen reader users.`

这是因为 `cmdk` 的 `Command.Dialog` 内部封装了 Radix UI 的 Dialog，而 Radix 为了无障碍访问，强制要求 Dialog 必须有一个 Title。

虽然可以加一个 `VisuallyHidden` 的标题来解决，但我最终选择了更"暴力"但也更灵活的方案：**放弃 `Command.Dialog`，自己实现 Modal**。

我移除了 `Command.Dialog` 包装器，直接使用 `Command` 组件，并自己写了一个 `fixed inset-0` 的遮罩层。

```tsx
{open && (
  <div className="fixed inset-0 z-50 ...">
    {/* 背景遮罩 */}
    <div onClick={() => setOpen(false)} ... />
    
    {/* 搜索框主体 */}
    <Command>...</Command>
  </div>
)}
```

这样不仅彻底解决了报错，还让我能更精细地控制动画效果（比如使用了 `tailwindcss-animate` 的 `zoom-in-95` 效果）。

### 2. ESC 键失效

既然放弃了 `Command.Dialog`，也就失去了 Radix 自带的"按下 ESC 关闭"的功能。我发现点开搜索框后，按 ESC 没反应，体验非常糟糕。

解决办法很简单，手动监听一下 ESC 键：

```tsx
if (e.key === "Escape") {
  setOpen(false);
}
```

### 3. 路由跳转后关闭弹窗

用户选中搜索结果跳转后，搜索框默认是不会关闭的。我们需要在执行跳转逻辑时手动关闭它：

```tsx
const runCommand = React.useCallback((command: () => void) => {
  setOpen(false); // 先关闭
  command();      // 再跳转
}, []);
```

## 总结

现在的搜索功能已经非常顺滑了：
1.  **零延迟**：本地过滤，毫秒级响应。
2.  **全键盘操作**：从呼出到选择再到跳转，手不需要离开键盘。
3.  **全站索引**：不仅能搜文章，还能跳转到简历、项目等页面。

这就是我想要的博客体验。
