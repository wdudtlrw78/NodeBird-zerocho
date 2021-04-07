import React from "react";
import Head from "next/head";
import AppLayouts from "../components/AppLayouts";

const Profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayouts>내 프로필</AppLayouts>
    </>
  );
};

export default Profile;
