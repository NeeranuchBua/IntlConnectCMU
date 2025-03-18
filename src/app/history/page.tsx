import prisma from '@/lib/prisma';
import HistoryPage from './HistoryPage';

const History = async () => {
  const posts = await prisma.post.findMany();
  return (
    <HistoryPage posts={posts} />
  )
}

export default History