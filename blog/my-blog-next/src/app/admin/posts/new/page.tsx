'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');

  // 自动生成 Slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // 简单的 slug 生成逻辑：转小写，空格变横杠，去除非法字符
    if (!slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setSlug(autoSlug);
    }
  };

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          published: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      // 成功后跳转回 Dashboard
      router.push('/admin');
      router.refresh(); // 刷新数据
    } catch (error) {
      alert('发布失败: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            新建文章
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
            发布文章
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
                  onChange={handleTitleChange}
                  placeholder="输入文章标题..."
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
                    placeholder="my-awesome-post"
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Next.js, React, Tech"
                    className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1 text-sm text-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">摘要</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="简短的描述一下这篇文章..."
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
                placeholder="开始使用 Markdown 写作..."
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
