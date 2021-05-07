import Head from 'next/head';
import React from 'react';
import AppLayouts from '../components/AppLayouts';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
  const followerList = [
    { nickname: 'test 1' },
    { nickname: 'test 2' },
    { nickname: 'test 3' },
    { nickname: 'test 4' },
    { nickname: 'test 5' },
    { nickname: 'test 6' },
    { nickname: 'test 7' },
    { nickname: 'test 8' },
    { nickname: 'test 9' },
  ];

  const followingList = [
    { nickname: 'test 1' },
    { nickname: 'test 2' },
    { nickname: 'test 3' },
  ];

  return (
    <>
      <Head>
        <title>내 프로필 | MomoBird</title>
      </Head>
      <AppLayouts>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayouts>
    </>
  );
};

export default Profile;
