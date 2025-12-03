import { getAllProjectIds, getProjectData } from '@/lib/projects';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projectData = await getProjectData(id);

  return {
    title: `${projectData.title} | 项目展示`,
    description: projectData.description,
  };
}

export async function generateStaticParams() {
  const paths = getAllProjectIds();
  return paths.map((path) => path.params);
}

export default async function Project({ params }: Props) {
  const { id } = await params;
  const projectData = await getProjectData(id);

  return (
    <article className="max-w-4xl mx-auto">
      {/* 项目头部 */}
      <header className="mb-10 border-b pb-8">
        <div className="mb-4">
          <Link href="/resume" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← 返回简历
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
              {projectData.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {projectData.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {projectData.tags && projectData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 项目链接按钮 */}
          <div className="flex gap-3 shrink-0">
            {projectData.demoLink && (
              <a 
                href={projectData.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                查看演示 ↗
              </a>
            )}
            {projectData.repoLink && (
              <a 
                href={projectData.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
              >
                源码仓库 ↗
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          项目时间: <time>{projectData.date}</time>
        </div>
      </header>

      {/* 项目详情内容 */}
      <div 
        className="prose prose-lg prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: projectData.contentHtml || '' }} 
      />
    </article>
  );
}
