'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // 使用 React.use() 解包 params
  const { id } = use(params);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);

  // 加载文章数据
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 注意：这里我们需要一个获取单篇文章 JSON 的 API
        // 但我们目前只有 /api/posts (list) 和 /api/posts/[id] (delete/update)
        // 我们可以复用前台的 fetch 逻辑，或者扩展 /api/posts/[id] 的 GET 方法
        // 为了简单，我们先尝试扩展 /api/posts/[id] 增加 GET 方法
        
        // 稍等，我需要先去给 route.ts 加一个 GET 方法，否则这里没法拿数据
        // 既然这样，我先假设这个 API 存在，马上就去补上
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        const { data } = await response.json();
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setTags(data.tags?.join(', ') || '');
        setPublished(data.published);
      } catch (error) {
        alert('加载文章失败');
        router.push('/admin/posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      // 成功后跳转回列表
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      alert('更新失败: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/posts"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            编辑文章
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {content.length} 字符
          </span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存修改
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 左侧：编辑区 */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* 元数据输入区域 */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-2 text-lg font-bold text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">摘要</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-300 resize-none"
                />
              </div>
            </div>

            {/* 正文编辑区 */}
            <div className="flex-1 min-h-[500px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full resize-none bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 font-mono text-base leading-relaxed p-0"
              />
            </div>
          </div>
        </div>

        {/* 右侧：预览区 */}
        <div className="w-1/2 bg-gray-50 dark:bg-gray-800/30 overflow-y-auto p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="mb-8">{title || '文章标题'}</h1>
            <ReactMarkdown>{content || '*预览区域*'}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}
