import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          欢迎来到我的博客
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          这里记录我的技术成长、项目经验和生活思考。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-100">最新文章</h2>
        <div className="grid gap-6">
          {allPostsData.map(({ id, date, title, description, tags }) => (
            <article key={id} className="group relative flex flex-col space-y-2 border p-6 rounded-lg hover:border-gray-300 transition-colors bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600">
                  <Link href={`/posts/${id}`}>
                    <span className="absolute inset-0" />
                    {title}
                  </Link>
                </h3>
                <time className="text-sm text-gray-500 whitespace-nowrap ml-4">{date}</time>
              </div>
              
              <p className="text-gray-500 line-clamp-2">
                {description}
              </p>

              {tags && tags.length > 0 && (
                <div className="flex gap-2 mt-4 pt-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
