import Head from 'next/head';
import React from 'react';
import AppLayouts from '../components/AppLayouts';

const Profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 | MomoBird</title>
      </Head>
      <AppLayouts>내 프로필</AppLayouts>
    </>
  );
};

export default Profile;
