import Head from 'next/head';
import React from 'react';
import AppLayouts from '../components/AppLayouts';

const Signup = () => {
  return (
    <>
      <Head>
        <title>회원가입 | MomoBird</title>
      </Head>
      <AppLayouts>회원가입 페이지</AppLayouts>
    </>
  );
};

export default Signup;
