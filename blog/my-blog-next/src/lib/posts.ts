import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 定义文章元数据的类型
export interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  contentHtml?: string;
}

// 博客文章存放的目录
const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 获取所有文章列表（按日期排序）
 */
export function getSortedPostsData(): PostData[] {
  // 如果目录不存在，创建一个空数组返回，避免报错
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 获取目录下所有文件名
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames.map((fileName) => {
    // 去掉 ".md" 后缀作为 ID
    const id = fileName.replace(/\.md$/, '');

    // 读取 markdown 文件内容
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析 frontmatter
    const matterResult = matter(fileContents);

    // 组合 id 和 frontmatter 数据
    return {
      id,
      ...(matterResult.data as { title: string; date: string; tags: string[]; description: string }),
    };
  });

  // 按日期降序排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * 获取所有文章 ID 列表（用于 generateStaticParams）
 */
export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

/**
 * 获取单篇文章的详细数据
 */
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
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
    ...(matterResult.data as { title: string; date: string; tags: string[]; description: string }),
  };
}
