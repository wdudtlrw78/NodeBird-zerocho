import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
// import withReduxSaga from 'net-redux-saga'; // Next 적용하기전에 이런 디펜던시들은 하나 씩 없애주는게 좋다. package.json도 제거
// 조금이라도 디펜던시들이 적어야 나중에 버전 업데이트를 할 때 충돌 위험성이 적어진다.
import wrapper from '../store/configuerStore';

// - \_app.js 는 pages들의 공통 부분

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird); // next-redux 자체에서 provider를 제공해주기 때문에 대신에 HOC방식으로 wrapper.withRedux 감싸준다.
