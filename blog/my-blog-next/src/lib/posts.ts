import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import dbConnect from './db';
import Post, { IPostDocument } from '@/models/Post';

// 定义文章元数据的类型
export interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  description: string;
  contentHtml?: string;
  source?: 'local' | 'database'; // 标识来源
}

// 博客文章存放的目录
const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 获取所有文章列表（按日期排序）
 * 支持混合数据源：本地 Markdown + MongoDB
 */
export async function getSortedPostsData(): Promise<PostData[]> {
  // 1. 获取本地 Markdown 文章
  let localPosts: PostData[] = [];
  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    localPosts = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        ...(matterResult.data as { title: string; date: string; tags: string[]; category: string; description: string }),
        source: 'local',
      };
    });
  }

  // 2. 获取 MongoDB 文章
  let dbPosts: PostData[] = [];
  try {
    await dbConnect();
    // 只查询已发布的文章
    const posts = await Post.find({ published: true }).sort({ date: -1 }).lean<IPostDocument[]>();
    
    dbPosts = posts.map((post) => ({
      id: post.slug, // 使用 slug 作为 id
      title: post.title,
      date: new Date(post.date).toISOString().split('T')[0], // 格式化日期 YYYY-MM-DD
      tags: post.tags,
      category: post.category || 'Uncategorized',
      description: post.excerpt || '',
      source: 'database',
    }));
  } catch (error) {
    console.error('Failed to fetch posts from database:', error);
    // 数据库挂了不影响本地文章展示
  }

  // 3. 合并并排序
  const allPosts = [...localPosts, ...dbPosts];
  
  return allPosts.sort((a, b) => {
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
 * 优先查找本地文件，如果不存在则查找数据库
 */
export async function getPostData(id: string) {
  let rawContent = '';
  let frontmatterData: any = {};
  let source: 'local' | 'database' = 'local';

  const fullPath = path.join(postsDirectory, `${id}.md`);

  // 1. 尝试从本地读取
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    rawContent = matterResult.content;
    frontmatterData = matterResult.data;
  } 
  // 2. 尝试从数据库读取
  else {
    await dbConnect();
    // 查找 slug 匹配的文章
    const post = await Post.findOne({ slug: id }).lean<IPostDocument>();
    
    if (!post) {
      // 如果两边都找不到，抛出错误，页面会显示 404
      throw new Error(`Post not found: ${id}`);
    }

    rawContent = post.content;
    frontmatterData = {
      title: post.title,
      date: new Date(post.date).toISOString().split('T')[0],
      tags: post.tags,
      category: post.category || 'Uncategorized',
      description: post.excerpt || '',
    };
    source = 'database';
  }

  // 3. 使用 unified 管道将 markdown 转换为 HTML
  const processedContent = await unified()
    .use(remarkParse) // 解析 markdown
    .use(remarkRehype) // 转换为 HTML AST
    .use(rehypePrettyCode, {
      // 代码高亮配置
      theme: 'github-dark',
      // 防止代码块背景色与 tailwind typography 冲突
      keepBackground: true,
      onVisitLine(node: any) {
        // 防止空行塌陷
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
      },
    })
    .use(rehypeStringify) // 转换为 HTML 字符串
    .process(rawContent);

  const contentHtml = processedContent.toString();

  // 组合 id, contentHtml 和 frontmatter 数据
  return {
    id,
    contentHtml,
    ...(frontmatterData as { title: string; date: string; tags: string[]; category: string; description: string }),
    source,
  };
}
