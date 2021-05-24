import Head from 'next/head';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayouts from '../components/AppLayouts';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | MomoBird</title>
      </Head>
      <AppLayouts>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.Followings} />
        <FollowList header="팔로워 목록" data={me.Followers} />
      </AppLayouts>
    </>
  );
};

export default Profile;
