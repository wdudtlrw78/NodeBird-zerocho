import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";
import withReduxSaga from "next-redux-saga";
import wrapper from "../store/configuerStore";

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

export default wrapper.withRedux(withReduxSaga(NodeBird)); // next-redux 자체에서 provider를 제공해주기 때문에 대신에 HOC방식으로 wrapper.withRedux 감싸준다.
