import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Calendar, Tag } from 'lucide-react';

export const metadata = {
  title: '文章列表 | My Blog',
  description: '所有的技术文章和思考',
};

export default function PostsPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">所有文章</h1>
      
      <div className="grid gap-6">
        {allPostsData.map(({ id, date, title, description, tags }) => (
          <article key={id} className="group relative flex flex-col space-y-2 border p-6 rounded-lg hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-900/50 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <Link href={`/posts/${id}`}>
                  <span className="absolute inset-0" />
                  {title}
                </Link>
              </h3>
              <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
              </time>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
              {description}
            </p>

            {tags && tags.length > 0 && (
              <div className="flex gap-2 mt-4 pt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
