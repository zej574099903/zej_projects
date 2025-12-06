import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import PostChunk from '@/models/PostChunk';
import { getEmbeddings } from '@/lib/ai';
import { getSortedPostsData, getPostRawContent } from '@/lib/posts';
import matter from 'gray-matter';

// 简单的文本切分函数
function splitText(text: string, maxLength: number = 800): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // 按段落分割
  const paragraphs = text.split('\n\n');

  for (const para of paragraphs) {
    // 如果当前段落加进去超长了，就先保存当前的
    if ((currentChunk + para).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += para + '\n\n';
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST() {
  try {
    await dbConnect();
    
    console.log('Starting embedding generation...');
    // 先不删除旧数据，方便调试
    // await PostChunk.deleteMany({});
    
    let processedCount = 0;
    
    // 1. 获取所有文章元数据 (包含本地和数据库)
    const allPosts = await getSortedPostsData();

    for (const postMeta of allPosts) {
        console.log(`Processing post: ${postMeta.title} (${postMeta.source})`);
        
        let content = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let postId: any = null;

        if (postMeta.source === 'database') {
            const dbPost = await Post.findOne({ slug: postMeta.id });
            if (dbPost) {
                content = dbPost.content;
                postId = dbPost._id;
            }
        } else {
            // 本地文章
            const raw = getPostRawContent(postMeta.id);
            if (raw) {
                const { content: mdContent } = matter(raw);
                content = mdContent;
                
                // 为了避免 Post Schema 校验失败（因为必填字段可能没填全），
                // 或者是数据库连接问题，我们这里尝试查找，找不到就算了，不强行 upsert。
                // 对于 PostChunk，我们可以暂时放宽 postId 的关联要求，或者使用一个固定的 "Local Post" 占位符 ID。
                // 但为了简单，我们先尝试找一下之前阅读量功能可能创建的占位记录。
                const localPostRecord = await Post.findOne({ slug: postMeta.id });
                if (localPostRecord) {
                    postId = localPostRecord._id;
                } else {
                    // 如果连占位记录都没有，说明还没人看过这篇文章。
                    // 我们可以跳过，或者为了搜索能搜到，我们创建一个临时的 ObjectId
                    // 注意：这会导致 populate() 失败，但在搜索结果展示时我们主要用 slug 跳转，影响不大。
                    // 为了稳妥，我们还是 create 一个极简的占位记录
                    try {
                         const newPost = await Post.create({
                            slug: postMeta.id,
                            title: postMeta.title, // 必填
                            content: 'Placeholder for local post embedding', // 必填
                            published: false,
                            views: 0
                        });
                        postId = newPost._id;
                    } catch (e) {
                        console.error(`Failed to create placeholder for ${postMeta.id}:`, e);
                        // 如果创建失败，可能是 title 重复等问题，跳过该文章
                        continue;
                    }
                }
            }
        }

        if (!content || !postId) {
            console.warn(`Skipping ${postMeta.id}: No content or ID found.`);
            continue;
        }
        
        // 清除该文章旧的 chunks
        await PostChunk.deleteMany({ slug: postMeta.id });

        // 切分并生成向量
        const chunks = splitText(content);
        for (let i = 0; i < chunks.length; i++) {
            const chunkContent = chunks[i];
            const textToEmbed = `Title: ${postMeta.title}\n\n${chunkContent}`;
            
            try {
                const embedding = await getEmbeddings(textToEmbed);
                await PostChunk.create({
                    postId: postId,
                    slug: postMeta.id,
                    title: postMeta.title,
                    content: chunkContent,
                    embedding,
                    chunkIndex: i,
                });
            } catch (aiError) {
                 console.error(`OpenAI Error for ${postMeta.title}:`, aiError);
                 throw new Error(`OpenAI API failed: ${(aiError as Error).message}`);
            }
        }
        processedCount++;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedCount} posts.` 
    });

  } catch (error) {
    console.error('Embedding generation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
