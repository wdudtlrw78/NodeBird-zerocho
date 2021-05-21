import Head from 'next/head';
import React from 'react';
import { useSelector } from 'react-redux';
import AppLayouts from '../components/AppLayouts';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
  const { me } = useSelector((state) => state.user);
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
