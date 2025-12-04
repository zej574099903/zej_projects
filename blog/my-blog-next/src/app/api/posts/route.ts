import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

// GET /api/posts - 获取所有文章
export async function GET() {
  try {
    // 1. 连接数据库
    await dbConnect();

    // 2. 查询所有文章，按日期倒序排列
    const posts = await Post.find({}).sort({ date: -1 });

    // 3. 返回结果
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 创建新文章
export async function POST(request: NextRequest) {
  try {
    // 1. 连接数据库
    await dbConnect();

    // 2. 解析请求体
    const body = await request.json();

    // 3. 创建新文章
    // 注意：mongoose 会自动校验必填字段 (title, slug, content)
    const post = await Post.create(body);

    // 4. 返回创建成功的文章
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
