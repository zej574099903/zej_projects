import { getSortedPostsData } from '@/lib/posts';
import HomePageContent from '@/components/home-page-content';

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  console.log('Server: Fetched posts count:', allPostsData.length);
  if (allPostsData.length > 0) {
    console.log('Server: First post sample:', JSON.stringify(allPostsData[0], null, 2));
  }

  return <HomePageContent posts={allPostsData} />;
}
