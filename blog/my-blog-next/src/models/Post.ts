import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * 博客文章的接口定义
 * 对应 content/posts/*.md 的 Frontmatter 和内容
 */
export interface IPost {
  title: string;        // 标题
  slug: string;         // URL 路径 (例如: building-my-blog-with-nextjs)
  content: string;      // Markdown 正文
  excerpt?: string;     // 摘要 (对应 description)
  date: Date;           // 发布日期
  tags: string[];       // 标签数组
  category?: string;    // 分类
  coverImage?: string;  // 封面图 URL (可选)
  published: boolean;   // 是否已发布 (用于草稿功能)
  createdAt: Date;      // 创建时间 (数据库自动生成)
  updatedAt: Date;      // 更新时间 (数据库自动生成)
}

// 扩展 Mongoose 的 Document 接口
export interface IPostDocument extends IPost, Document {}

/**
 * Mongoose Schema 定义
 * 定义数据在 MongoDB 中的结构
 */
const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, '文章标题是必填项'],
      trim: true,
      maxlength: [100, '标题不能超过100个字符'],
    },
    slug: {
      type: String,
      required: [true, 'URL Slug 是必填项'],
      unique: true, // 保证 URL 唯一
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, '文章内容是必填项'],
    },
    excerpt: {
      type: String,
      maxlength: [300, '摘要不能超过300个字符'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String], // 字符串数组
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false, // 默认是草稿
    },
  },
  {
    // 自动添加 createdAt 和 updatedAt 字段
    timestamps: true,
  }
);

// 防止在热重载时重复编译模型
// 如果 mongoose.models.Post 已经存在，就使用它；否则创建一个新的模型
const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
