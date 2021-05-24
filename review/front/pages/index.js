import { useSelector } from 'react-redux';
import AppLayouts from '../components/AppLayouts';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  return (
    <AppLayouts>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayouts>
  );
};

export default Home;
