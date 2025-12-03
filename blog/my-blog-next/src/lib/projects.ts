import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 定义项目元数据的类型
export interface ProjectData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description?: string;
  demoLink?: string;
  repoLink?: string;
  priority?: number;
  coverImage?: string;
  contentHtml?: string;
}

// 项目文件存放的目录
const projectsDirectory = path.join(process.cwd(), 'content/projects');

/**
 * 获取所有项目 ID 列表（用于 generateStaticParams）
 */
export function getAllProjectIds() {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

/**
 * 获取单个项目的详细数据
 */
export async function getProjectData(id: string) {
  const fullPath = path.join(projectsDirectory, `${id}.md`);
  
  // 如果文件不存在，抛出错误或返回 null (这里直接抛错让 Next.js 处理 404)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Project not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // 使用 gray-matter 解析 frontmatter
  const matterResult = matter(fileContents);

  // 使用 remark 将 markdown 转换为 HTML 字符串
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 组合 id, contentHtml 和 frontmatter 数据
  return {
    id,
    contentHtml,
    ...(matterResult.data as { 
      title: string; 
      date: string; 
      tags: string[]; 
      description?: string;
      demoLink?: string;
      repoLink?: string;
      priority?: number;
      coverImage?: string;
    }),
  };
}
