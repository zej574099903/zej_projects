'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './copy-button';

export function CodeBlockEnhancer() {
  useEffect(() => {
    // 查找所有 rehype-pretty-code 生成的代码块容器
    const figures = document.querySelectorAll('figure[data-rehype-pretty-code-figure]');

    figures.forEach((figure) => {
      // 避免重复添加
      if (figure.querySelector('.copy-btn-wrapper')) return;

      // 确保容器相对定位，以便按钮绝对定位
      if (figure instanceof HTMLElement) {
        figure.style.position = 'relative';
        figure.classList.add('group'); // 用于 hover 显示
      }

      // 获取代码文本
      // rehype-pretty-code 通常将代码放在 pre > code 中，或者 pre 中
      // 注意：这里获取的是textContent，可能会包含行号等杂质，取决于具体渲染结构
      // 更好的做法是在构建时将 raw code 放到 data-raw 属性中
      // 但这里我们尝试从 DOM 提取纯文本
      const pre = figure.querySelector('pre');
      if (!pre) return;

      // 尝试清理行号等不可见字符（如果有）
      // 这里简单获取 innerText
      const codeText = pre.innerText;

      // 创建一个容器来挂载 React 组件
      const wrapper = document.createElement('div');
      wrapper.className = 'copy-btn-wrapper';
      figure.appendChild(wrapper);

      const root = createRoot(wrapper);
      root.render(<CopyButton text={codeText} />);
    });
  }, []);

  return null;
}
