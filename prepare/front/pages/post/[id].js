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
        <link rel="shortcut icon" href="/favicon.ico"></link>
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

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
