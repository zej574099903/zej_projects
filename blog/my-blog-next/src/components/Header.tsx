import Link from 'next/link';
import { Search } from '@/components/search';
import { PostData } from '@/lib/posts';

interface HeaderProps {
  posts?: PostData[];
}

export default function Header({ posts = [] }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white dark:bg-black dark:border-gray-800 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 supports-[backdrop-filter]:bg-white/60">
      {/* max-w-4xl mx-auto 限制内容最大宽度并居中，与正文保持一致 */}
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 左侧 Logo */}
        <div className="font-bold text-xl text-gray-800 dark:text-gray-100">
          <Link href="/">
            My Blog
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* 右侧导航菜单 */}
          <nav className="flex gap-4 sm:gap-6 text-gray-600 dark:text-gray-400 items-center">
            <Link href="/posts" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              文章
            </Link>
            <Link href="/resume" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              简历
            </Link>
          </nav>
          
          {/* 分隔线 */}
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />

          {/* 搜索组件 */}
          <Search posts={posts} />
        </div>
      </div>
    </header>
  );
}
