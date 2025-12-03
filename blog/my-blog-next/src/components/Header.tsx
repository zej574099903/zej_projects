import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      {/* max-w-4xl mx-auto 限制内容最大宽度并居中，与正文保持一致 */}
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 左侧 Logo */}
        <div className="font-bold text-xl text-gray-800">
          <Link href="/">
            My Blog
          </Link>
        </div>

        {/* 右侧导航菜单 */}
        <nav className="flex gap-6 text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            首页
          </Link>
          {/* <Link href="/about" className="hover:text-gray-900 transition-colors">
            关于
          </Link> */}
          <Link href="/resume" className="hover:text-gray-900 transition-colors">
            简历
          </Link>
        </nav>
      </div>
    </header>
  );
}
