// 게시글 공유하기
// post/[id].js : id가 계속 바뀐다. 1, 2, 3, 4 ... 순서대로 올라간다
// Next에서 다이나믹 라우팅 지원

import React from 'react';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import Head from 'next/head';
import axios from 'axios';
import { useSelector } from 'react-redux';
import wrapper from '../../store/configuerStore';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query;

  // if (router.isFallback) {
  //   return <div>...로딩중</div>;
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'}
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// getStaticPaths는 getStaticProps랑 무조건 같이 써야된다. 그리고 다우나믹 라우팅일 때

// 1번 게시글이 미리 빌드가 된다.
// 다우나믹 라우팅이기 때문에 아이디가 계속 바뀔 수 있는데 getStaticProps는 미리 그 페이지들을 빌드해서 HTML로 만든다.
// 그래서 이렇게 미리 만들 것들을 params로 지정한다.
// params에 없는 게시글을 쓰면 ex 4) 에러 발생한다. 그러면 axios를 쓸 수 있는데 가져와서 post 전체/list id를 가져와서 다 넣어주는 방식
// 이러면 의미가 없는게 사용자들이 post를 몇 개 작성할 줄 모르는데 전부다 HTML로 만들어주면 페이스북같은경우 수조개 되는데 말이안된다.
// 그래서 getStaticPaths와 getStaticPaths는 여기 paths가 어느정도 제한이 있는 ex) 개인블로그 등 제한을 둬야한다.

// fallback : false면 params에 없는 id면 에러가 뜨는데 true로 하면 에러가 안뜬다 (대신 SSR이 안되고 잠깐 CSR로)
//   if (router.isFallback) {
//   return <div>...로딩중</div>;
// } 윗 부부분에다가 적어놓고
// fallback: true인데 params 경로가 없으면 거기에 해당하는 getStaticPaths 내부를 서버로 부터 불러온다.
// 예를들어 paths에서 4번 있는지 찾아보고 있으면 HTML을 가져오면되는데 없으면 getStaticPaths을 실행해서 화면을 그려주는데 그 사이에 ...로딩중 실행됬다가(CSR)
// 데이터 오면 위 return 의 <AppLayout> 부분 실행하는
// 장점은 HTML이기 때문에 서버 로딩속도가 매우 빨라진다. 하지만 사용하기가 힘들다.

// export async function getStaticPaths() {
//   // const result = await axios.get('/post/list');
//   return {
//     paths: [{ params: { id: '1' } }, { params: { id: '2' } }, { params: { id: '3' } }],
//     fallback: true,
//   };
// }

// export const getStaticProps = wrapper.getServerSideProps

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // profile 페이지도 항상 뭘 써야할지 생각해야한다.
  // 이 화면은 로그인 사용자에 따라서 다른게 보여준다.
  // 그럼 getServerSideProps
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id, // getServerSidePropss나 statictProps 안에서는 context.parms.id 또는 context.query.id하면 useRouter()에 똑같이 접근할 수 있다.
  });

  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Post;
