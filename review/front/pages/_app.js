import React from 'react';
import ProTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import withReduxSaga from 'next-redux-saga';
import wrapper from '../store/configureStore';

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

export default wrapper.withRedux(withReduxSaga(NodeBird));
