import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PostChunk from '@/models/PostChunk';
import { getEmbeddings } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();

    // 1. 将用户的问题转换为向量
    // (目前是 Plan B 随机向量，所以搜索结果是随机的)
    const vector = await getEmbeddings(query);

    // 2. 使用 MongoDB Atlas Vector Search 聚合查询
    const results = await PostChunk.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // 必须与 Atlas 中创建的索引名一致
          path: 'embedding',     // 向量字段路径
          queryVector: vector,   // 查询向量
          numCandidates: 100,    // 候选集大小 (越大越准但越慢)
          limit: 5               // 返回结果数量
        }
      },
      {
        $project: {
          _id: 0,
          slug: 1,
          title: 1,
          content: 1,
          score: { $meta: 'vectorSearchScore' } // 返回相似度分数
        }
      }
    ]);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
