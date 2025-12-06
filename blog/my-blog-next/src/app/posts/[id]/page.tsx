import { getAllPostIds, getPostData } from '@/lib/posts';
import { Comments } from '@/components/comments';
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
  const postData = await getPostData(id);

  return (
    <article className="max-w-3xl mx-auto">
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
        <div className="text-gray-500 dark:text-gray-400">
          <time>{postData.date}</time>
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

      <Comments />
    </article>
  );
}
