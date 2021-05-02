// https://nextjs.org/docs/api-reference/next.config.js/introduction
// webpack은 Next의 기본 설정이 있기 때문에 다른 리액트 페이지 하듯이 webpack 설정하는 것이 아니라 config로 통해서 기본 설정을 바꿔가는 식으로 해야한다.

// process.env 설정하는 방법
// 명렁어를 치면 next.config.js가 한 번 쭉 읽히는데
// package.json / "build": "ANALUZE=true NODE_ENV=production next build" 이렇게 해주면 간단하다.
// 문제는 window에서 안된다. 리눅스나 맥에서는 되는데.
// window는 npm i cross-env -> "build": "cross-env ANALYZE=true NODE_ENV=production next build"
// npm i build 하면 enabled가 true로 되면서 server.html, 과 client.html 두 브라우저 창이 뜬다.
// server.html는 신경안써두돠는데, client.html는 사용자한테 전달되기 때문에 여기 용량이 크면 로딩속도가 줄어드기 때문에 유심히 봐야할 것이
// 큰 박스인 것들은 어차피 무조건 써야하고 안쪼개지기 때문에 어쩔 수 없는데
// 예를들어서 moment 안에 locale 안에 작은 파일들(언어 팩)이 수십개 쪼개져 있다. (커스텀 웹팩과 bundle-analyzer 13:30초)이런 것들은 주의깊게 봐야한다.
// 뭉쳐있는 것들은 못 없애는데 쪼개져있는 것들은 없앨 수 있다.
// 구글링 moment locale tree shaking 보통 tree shaking으로 검색하면 된다. (Tip 좋아요 숫자 높은 것이 효과 가능성이 높다)

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next 에서는 compression-webpack-plugin 내장되어 있다.
  // gzip(압축) npm i compression-webpack-plugin : JS, TS, CSS, HTML 용량이 작다고 생각할 수 있는데 까딱하면 1MB 넘어버리는 경우가 있기때문에 gzip으로 압축하면 용량이 확 준다.
  // 그리고 좋은점이 브라우저가 gzip으로 압축되어져 있으면 다시 압축해제 (브라우저가 알아서 해제한 다음 제공해준다)를 할 수 있는데 js나, html,css 파일이 있으면 무조건 압축해주는 것이 좋다.
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/), moment locale tree shaking 보통 tree shaking으로 검색하면 된다 (쪼개진 것 해결)
    ];

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval', // 배포 할 때 hidden-source-map 안하면 소스코드 노출된다.
      plugins,
    };
  },
});
