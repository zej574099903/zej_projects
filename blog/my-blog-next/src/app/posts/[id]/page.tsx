import { getAllPostIds, getPostData, PostData } from '@/lib/posts';
import { Comments } from '@/components/comments';
import { ViewCounter } from '@/components/view-counter';
import { ReadingProgress } from '@/components/reading-progress';
import { CodeBlockEnhancer } from '@/components/code-block-enhancer';
import { Metadata } from 'next';
import { Folder } from 'lucide-react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const postData = await getPostData(id);

  return {
    title: postData.title,
    description: postData.description,
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => path.params);
}

export default async function Post({ params }: Props) {
  const { id } = await params;
  const postData = await getPostData(id) as PostData;

  return (
    <article className="max-w-3xl mx-auto relative">
      <ReadingProgress />
      
      <header className="mb-8 text-center">
        {postData.category && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
            <Folder className="w-4 h-4" />
            {postData.category}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl mb-2">
          {postData.title}
        </h1>
        <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-4">
          <time>{postData.date}</time>
          {/* 使用 ViewCounter 组件显示阅读量，并自动触发计数 */}
          {/* 传入 initialViews 可以在数据库文章加载时提供即时反馈(虽然是旧值) */}
          {/* 对于本地文章，initialViews 是 0，组件加载后会更新为真实值 */}
          <ViewCounter slug={id} initialViews={postData.views} />
        </div>
        {postData.tags && postData.tags.length > 0 && (
          <div className="flex gap-2 justify-center mt-4">
            {postData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-blue-900/30 text-gray-800 dark:text-blue-200 border dark:border-blue-800/50">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div 
        className="prose prose-lg prose-slate max-w-none dark:prose-invert dark:prose-p:text-gray-300 dark:prose-headings:text-gray-100 dark:prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} 
      />

      <CodeBlockEnhancer />
      <Comments />
    </article>
  );
}
