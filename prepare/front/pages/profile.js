import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configuerStore';

// SWR
// 서버 구축안된 상태에서 더미데이터 활용
// useSWR('key', () => 값) 값에 더미데이터 넣으면 된다 (faker);
// useSelector처럼 여러 컴포넌트 = const { data } = useSWR('키', fetcher) 만 넣으면 모든 컴포넌트에 공통으로 사용, 키가 같으면 같은 data이다.

// fetcher = 주소를 어떻게 가져올지에 대해 적기
// fetcher는 유틸로 따로 만들어서 swr마다 공유해서 사용하시거나 개조해서 사용하면된다.
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  // const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  // 적어도 get요청만큼은 간단하게 swr(SSR도 된다)로 설정할 수 있다. Next에서 만든 라이브러리
  // data나 error 둘다 없으면 로딩 중이고 1개라도 있으면 성공했거나 실패
  // limit방식은 그다지 효율적이지 않다 처음에 3명 불러오다가 그다음에 6명불러오고 그 다음 9명 이렇게 되면 중복 data가 발생한다. 3명 불러오고 6명 불러오면 앞에 3명이 겹친다.
  // 그 부분에서 data 낭비가 발생
  // 해결책은 offset과 limit을 같이 사용해서 기존 불러왔던 데이터는 캐싱해주고 새로운것은 concat만 해준다.
  // useEffect에 followersData의 id로 비교해서 기존 state에 concat하면 된다.
  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher,
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher,
  );

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    // 로그인 안한채로 프로필 페이지 이동했을시
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        {/* swr에서 loading은 data도 없고 error도 없을 때 loading 중이다.*/}
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingError}
        />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
      </AppLayout>
    </>
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

  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;
