import { getSortedPostsData } from '@/lib/posts';
import HomePageContent from '@/components/home-page-content';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return <HomePageContent posts={allPostsData} />;
}
