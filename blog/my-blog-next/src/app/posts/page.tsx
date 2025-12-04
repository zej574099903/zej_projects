import { getSortedPostsData } from '@/lib/posts';
import { PostsList } from '@/components/posts-list';

export const metadata = {
  title: '文章列表 | My Blog',
  description: '所有的技术文章和思考',
};

export default async function PostsPage() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">所有文章</h1>
      <PostsList posts={allPostsData} />
    </div>
  );
}
