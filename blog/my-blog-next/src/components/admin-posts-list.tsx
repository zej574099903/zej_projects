'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  _id: string;
  title: string;
  slug: string;
  date: string;
  published: boolean;
  category?: string;
}

export default function AdminPostsList({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 删除文章
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作无法撤销。')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      
      setPosts(posts.filter(p => p._id !== id));
      router.refresh();
    } catch (error) {
      alert('删除出错');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  // 切换发布状态
  const handleTogglePublish = async (post: Post) => {
    setTogglingId(post._id);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      
      if (!res.ok) throw new Error('更新失败');

      await res.json();
      
      setPosts(posts.map(p => 
        p._id === post._id ? { ...p, published: !p.published } : p
      ));
      router.refresh();
    } catch (error) {
      alert('更新状态出错');
      console.error(error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <li key={post._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  post.published 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {post.published ? '已发布' : '草稿'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                <span>{format(new Date(post.date), 'yyyy-MM-dd')}</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  /{post.slug}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleTogglePublish(post)}
                disabled={!!togglingId}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                title={post.published ? "设为草稿" : "发布文章"}
              >
                {togglingId === post._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : post.published ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>

              <Link
                href={`/admin/posts/${post._id}/edit`}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
                title="编辑"
              >
                <Edit className="w-4 h-4" />
              </Link>

              <button
                onClick={() => handleDelete(post._id)}
                disabled={!!deletingId}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="删除"
              >
                {deletingId === post._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </li>
        ))}
        
        {posts.length === 0 && (
          <li className="p-8 text-center text-gray-500 dark:text-gray-400">
            暂无文章，去写一篇吧！
          </li>
        )}
      </ul>
    </div>
  );
}
