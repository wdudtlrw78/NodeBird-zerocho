import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayouts from '../components/AppLayouts';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  // PostCard() 안에 useEffect 에러 넣으면 ex) 게시글 8개이면 useEffect가 모두 다 발생해서 상위구간 index파일에 넣어준다.
  // 아니면 PostCard안에 retweetError에다가 리트윗 게시글 id까지 같이 넣어서 그 포스트카드만 리렌더링 방식도 있다.
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    // 스크롤 위치 판단
    function onScroll() {
      // console.log(
      //   window.scrollY, // 얼마나 내렸는지
      //   document.documentElement.clientHeight, // 화면에 보이는 길이
      //   document.documentElement.scrollHeight, // 총 길이
      //   // scrollHeight = scrollY + clientHeight
      // );

      // react-virtualized = ex) 많은 데이터를 화면에 데이터 3개까지만 보여지고 나머진 메모리에 저장된다.

      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostsLoading) {
          // // takeLatest , throttle 응답을 차단한다 요청까진 차단 X
          // 처음부터 REQUEST를 안보내는것이 좋다.
          // 로딩이 끝나면 실행 ( 이벤트 특성상 REQUEST 여러번 호출 방지 ) + throttle 적용
          dispatch({
            type: LOAD_POSTS_REQUEST,
            // data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      // 컴포넌트 내에서 addEventListener 한 것은 컴포넌트가 끝나기 전에 지워줘야 한다.
      // 해제 안해주면 메모리에 계속 쌓인다.
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading]);

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
