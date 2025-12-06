import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPostChunk {
  postId: mongoose.Types.ObjectId; // 关联原始文章
  slug: string;                    // 文章 Slug，方便跳转
  title: string;                   // 文章标题
  content: string;                 // 切片后的文本内容
  embedding: number[];             // OpenAI 生成的向量 (1536维)
  chunkIndex: number;              // 切片序号
}

export interface IPostChunkDocument extends IPostChunk, Document {}

const PostChunkSchema = new Schema<IPostChunkDocument>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
    // 这里不设索引，因为 Vector Search 索引是在 Atlas 也就是云端配置的
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
});

// 开发环境热重载处理
if (process.env.NODE_ENV === 'development' && mongoose.models.PostChunk) {
  delete mongoose.models.PostChunk;
}

const PostChunk: Model<IPostChunkDocument> =
  mongoose.models.PostChunk || mongoose.model<IPostChunkDocument>('PostChunk', PostChunkSchema);

export default PostChunk;
