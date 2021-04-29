import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';

import AppLayouts from '../components/AppLayouts';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configuerStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  // PostCard() 안에 useEffect 에러 넣으면 ex) 게시글 8개이면 useEffect가 모두 다 발생해서 상위구간 index파일에 넣어준다.
  // 아니면 PostCard안에 retweetError에다가 리트윗 게시글 id까지 같이 넣어서 그 포스트카드만 리렌더링 방식도 있다.
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

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

      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          // // takeLatest , throttle 응답을 차단한다 요청까진 차단 X
          // 처음부터 REQUEST를 안보내는것이 좋다.
          // 로딩이 끝나면 실행 ( 이벤트 특성상 REQUEST 여러번 호출 방지 ) + throttle 적용
          const lastId = mainPosts[mainPosts.length - 1]?.id; // lastId 스크롤 내릴 때 기존 똑같은 10개가 로딩되기 때문에 lastId 지정
          dispatch({
            type: LOAD_POSTS_REQUEST,
            // data: mainPosts[mainPosts.length - 1].id,
            lastId,
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
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayouts>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayouts>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // SSR적용 : 자동적으로 Home보다 먼저 실행된다. 그래야 알아서 데이터를 채운 다음에 화면에 렌더링된다.
  // 화면 렌더링 될 때에는 Redux의 데이터가 채워진채로 처음부터 존재하게 된다.
  console.log(context); // stort안에 context가 들어있다.
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  // HYDRATE
  // {type: "__NEXT_REDUX_WRAPPER_HYDRATE__", payload: {…}}
  // getServerSideProps에서 dispatch를 하면 store의 변화가 생기면서 각각의 LOAD_MY_INFO_REQUEST, LOAD_POSTS_REQUEST store에 정보가 들어간다.
  // 어떻게 들어가냐면 HYDRATE 액션(reduces.index)이 실행되면서 받는다.
  // Redux SSR 원리가 리덕스 데브툴의 @@INIT 에서는 초기상태(비어있음) 그대로 있지만 getServerSideProps 실행되고나서 결과를 HYDRATE 보내줘서 HYDRATE 액션이 실행된다(playload안에 index, user, post 결과가 나온다)
  // 문제가 아직 HYDRATE 조차도 user의 me랑 post의 mainPosts랑 두개가 안들어있다.
  // Diff안에 index 안에 또 index가 들어있다. (8분 대 시청)
  // 해결은 index의 rootReducer로 이동하자.

  //문제점 loadUserLoading : true, loadPostsLoding : true, true는 리퀘스트 때 true가 된다. 즉 REQUEST, REQUEST true가 되자마자 프론트 화면으로 돌아오는데
  // 원하는 바는 서버쪽에서 SUCESS, SUCESS 되고나서 데이터 완성 후 프론트 화면으로 건너오길 바란다.
  // 두개를 장착안하면
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise(); // sageTask는 configuerStore에서 설정했다.
});

export default Home;
