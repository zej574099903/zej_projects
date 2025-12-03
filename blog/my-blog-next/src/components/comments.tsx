"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { theme } = useTheme();

  return (
    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
      <Giscus
        id="comments"
        repo="zej574099903/zej_projects" // 例如: zej/my-blog-next
        repoId="R_kgDOQhddQA"
        category="Announcements" // 或者是你选择的 Discussion 分类
        categoryId="DIC_kwDOQhddQM4CzVSl"
        mapping="pathname" // 使用文章路径作为映射键
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'transparent_dark' : 'light'} // 根据当前主题自动切换
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
