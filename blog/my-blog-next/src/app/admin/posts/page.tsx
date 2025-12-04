import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Post, { IPostDocument } from '@/models/Post';
import AdminPostsList from '@/components/admin-posts-list';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  await dbConnect();
  // Fetch all posts, sorted by date desc
  // lean() converts mongoose docs to plain JS objects, easier to serialize
  const posts = await Post.find({}).sort({ date: -1 }).lean<IPostDocument[]>();

  // Serializable posts for client component
  const serializablePosts = posts.map(post => ({
    _id: post._id.toString(), // Convert ObjectId to string
    title: post.title,
    slug: post.slug,
    date: post.date.toISOString(),
    published: post.published,
    category: post.category,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              文章管理
            </h1>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            写新文章
          </Link>
        </div>

        <AdminPostsList initialPosts={serializablePosts} />
      </div>
    </div>
  );
}
