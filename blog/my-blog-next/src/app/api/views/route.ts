import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

// 增加阅读量
export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      // 如果文章在数据库中不存在（可能是本地文章），创建一个占位记录来统计阅读量
      const newPost = await Post.create({
        slug,
        title: `Local Post: ${slug}`, // 占位标题
        content: 'Placeholder for local post views tracking',
        published: false, // 标记为未发布，避免出现在文章列表中
        views: 1,
      });
      return NextResponse.json({ views: newPost.views });
    }

    return NextResponse.json({ views: post.views });
  } catch (error) {
    console.error('Failed to increment view count:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 获取阅读量
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const post = await Post.findOne({ slug }).select('views');

    if (!post) {
      return NextResponse.json({ views: 0 }); // 如果没找到，默认为 0
    }

    return NextResponse.json({ views: post.views });
  } catch (error) {
    console.error('Failed to fetch view count:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
