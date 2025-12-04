import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await auth();

  // 如果未登录，重定向到登录页
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            后台管理
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              欢迎, {session.user?.name || 'Admin'}
            </span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 功能卡片：新建文章 */}
          <Link 
            href="/admin/posts/new"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              ✍️ 写新文章
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              创建一个新的 Markdown 文章并发布到数据库。
            </p>
          </Link>

          {/* 功能卡片：文章管理 */}
          <Link 
            href="/admin/posts"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              📚 文章管理
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              查看、编辑和删除现有文章。
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
