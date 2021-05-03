// CSS SSR

// _app.js 위에 있는 것이 _document.js
// _app.js가 _document.js 로 감싸지면서 제일 위에있는 Html, head, body까지 수정할 수 있다.

// SSR 확인하는 방법은 일단 postman에서 send후 preview 보면 css 적용이 안될 것을 볼 수 있다.
// 확인 하는방법은 크롬에서 F12 설정에서 밑에보면 Debugger에서 Disable JavaScript 체크 후 새로고침하면
// 진짜로 서버에서 주는대로 HTML로만 받는데 style 적용이 되어있으면 SSR 적용 증거이다.

import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  // getInitialProps는 _document나 _app에서만 사용되는 특수한 메서드이다.
  // 다른 곳은 getServerSideProps 또는 getStaticProps 쓰인다.
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // enhanceApp : App 기능의 document에다가 sheet가 styled components들을 서버사이드렌더링 할 수 있게해주는 기능
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <doby>
          <Main />
          {/* IE 돌아가게하려면 : /polyfill.io 사이트에서 default, es2015 ~ 2019 선택   */}
          {/* 최신문법이나 최신 객체들 최신문법은 바벨로 바꾸면 되는데 Map이나 Set Promise 이런것들은 바벨로 해도 추가가 안된다.*/}
          {/* 그래서 바벨 폴리필은 쓰는데 바벨 폴리필은 너무 무거워서 요즘 뜨는게 폴리필.io가 쓰인다. */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </doby>
      </Html>
    );
  }
}
