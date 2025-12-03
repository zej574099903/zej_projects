import { getAllPostIds, getPostData } from '@/lib/posts';
import { Metadata } from 'next';

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

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => path.params);
}

export default async function Post({ params }: Props) {
  const { id } = await params;
  const postData = await getPostData(id);

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-2">
          {postData.title}
        </h1>
        <div className="text-gray-500 dark:text-gray-400">
          <time>{postData.date}</time>
        </div>
        {postData.tags && postData.tags.length > 0 && (
          <div className="flex gap-2 justify-center mt-4">
            {postData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div 
        className="prose prose-lg prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} 
      />
    </article>
  );
}
