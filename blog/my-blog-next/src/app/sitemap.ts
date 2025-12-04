import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getSortedPostsData();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zej-projects-955ocoomd-jhons-projects-97ec523f.vercel.app/';

  const posts = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...posts,
  ];
}
