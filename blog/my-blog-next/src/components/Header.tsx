import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white dark:bg-black dark:border-gray-800">
      {/* max-w-4xl mx-auto 限制内容最大宽度并居中，与正文保持一致 */}
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 左侧 Logo */}
        <div className="font-bold text-xl text-gray-800 dark:text-gray-100">
          <Link href="/">
            My Blog
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {/* 右侧导航菜单 */}
          <nav className="flex gap-6 text-gray-600 dark:text-gray-400">
            <Link href="/posts" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              文章
            </Link>
            {/* <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              关于
            </Link> */}
            <Link href="/resume" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              简历
            </Link>
          </nav>
          
          {/* 暗黑模式暂时隐藏，待 UI 重新设计后再上线 */}
          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
}
