import React from 'react';
import ProTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>MomoBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.proTypes = {
  Component: ProTypes.elementType.isRequired,
};

export default NodeBird;
