# Stack

- Front
  - React Hooks
  - Redux + Redux saga
  - Styled components
  - Ant Design
- Backend
  - Node
  - Express
  - Sequelize (MySQL)
  - SWR
  - Next.js (SSR)
- DevOps
  - AWS
    - EC2
    - Lambda
    - S3
    - Route53

# Note

## Intro

- 가상의 백엔드와 협업해보기

  - 시간적 손실 방지
  - 백엔드 개발자가 API 만들어주기까지 대기하는 것 보다 Dummy Data와 함께 프론트 화면 만들기
  - 가상의 State 만들기 (실무에서는 Redux나 MobX 상태관리)

- 백엔드 서버없이 next의 router api 대체할 수 있지만 실무에서는 아주 소규모 api 일때에만 쓰인다. ( 대규모는 스케일링 문제때문에 백엔드 서버를 따로 둔다. )

  <br>

## SSR, CSR

<br>

- 전통적인 <b>SSR</b> 방식

  - 모든 데이터가 매핑된 서비스 페이지를 클라이언트(브라우저)에게 바로 보여줄 수 있다.
  - 왕복과정이 복잡하다.
  - 브라우저 (/blog 요청 ) -> 프론트 서버 (/post 게시글 요청) -> 백엔드 서버 (실제 게시글 data 요청) -> 데이터 베이스 (data 받아서 보내준다) -> 백엔드 서버 -> 프론트 서버(data 와 html 합쳐서 보내준다) -> 브라우저
  - 장점
    - CSR보다 첫 번째 페이지 로딩속도가 빠르다.
    - 전체적으로 사용자에게 보여주는 콘텐츠 구성이 완료되는 시점은 빨라진다
    - SEO (search engine optimization) 쉽게 구성
  - 단점

    - 사용자가 사이트 클릭을 하게되면 전체적인 웹사이트를 다시 서버에서 받아오는 것과 동일하기 때문에 사용자 경험이 안좋아진다.
    - 서버를 이용해서 페이지를 구성하기 때문에 클라이언트에서 구성하는 CSR(client-side rendering)보다 페이지를 구성하는 속도는 늦어진다.
    - 서버의 과부화
      - 사용자가 클릭할 때마다 요청해서 서버에서 필요한 데이터를 가져와서 html을 만들어야 하므로
    - 사용자가 빠르게 웹사이트를 확인할 수 있지만, 동적으로 데이터를 처리하는 JS를 아직 다운로드 를 받지 못해서 여기저기 클릭하면 반응이 없는 경우가 발생할 수 있다.

      - TTV (Time to View) 과 TTI (Time to Interact)

        - CSR과 SSR을 시간(time)을 흘러가는 순서대로 분석해 보면 CSR은 사이트를 접속하게 되면 서버에서 index파일을 받아오고, index파일은 비어져 있기 떄문에 보이는 것이 없고 JS 파일들을 요청하게 된다. 그리고 최종적으로 동적으로 HTML을 생성할 수 있는 JS 파일들을 받아온다. 그리고 그 순간부터 웹사이트가 사용자로 부터 보여진다. 즉 CSR은 TTV 사용자가 웹사이트를 볼 수 있음과 동시에 TTI 클릭을 하거나 인터렉션이 가능하게 된다.

        - 반대로 SSR은 사이트를 접속하면 서버에서 이미 잘 만들어진 index파일을 받아오게 되고 사용자가 웹사이트 를 볼수있게된다. 하지만 아직 동적으로 제어할 수 있는 JS 파일들을 받아오지 않았으므로, 사용자가 클릭해도 아무런 반응을 볼 수 없다. 그래서 최종적으로 JS 파일들을 서버에서 받아와야지만 그때 부터 사용자 클릭을 처리할 수 있는 인터렉션이 가능해진다. SSR은 사용자가 사이트를 볼 수 있는 시간과 실제로 인터렉션을 할 수 있는 시간에 공백기간이 꽤 긴편이다.

- <b>SPA</b> 방식 (CSR)

  - SPA에서 페이지 넘어가는 것은 눈속임이다.

  - 브라우저가 프론트엔드 서버에서 어떤 페이지를 요청하든 하나의 js, html, css, img 받아온다 <b>data 없이</b>.
  - 즉 프론트 서버가 브라우저에게 화면은 내려주는데 데이터가 없다. 데이터가 없으면 프론트엔드는 로딩창을 띄어줘야 한다. 그러면서 바로 브라우저는 프론트 서버 말고 백엔드 서버에다가 /post 게시글들을 요청하고 백엔드 서버는 데이터베이스에서 실제 게시글 가져와서 백엔드 서버에서 받은 다음 바로 프론트 서버 말고 브라우저로 넘겨준다. 브라우저는 로딩창 없애고 백엔드 서버에서 받은 data를 그려준다.
  - 장점
    - 사용자에게 빠르게 인터렉션이(ex 로딩창) 필요할 때 (화면에 3초이상 아무것도 보이지않으면 고객들이 떠나기 때문에)
  - 단점
    - 모든 페이지를 불러와야하기 때문에 오히려 SSR보다 느려질 수 있다.
    - 검색엔진을 이용해 첫 페이지 방문했을 때 보여지는게 로딩창밖에(HTML 문서의 body 안에 root랑 src 만 있어서) 없다. 그래서 검색엔진에서 "이 페이지는 아무런 콘텐츠가 없고 로딩창밖에 없구나" 판단해서 검색엔진 순위에서 떨어진다.
      - 구글 검색엔진은 똑똑해서 SPA라고 판단하여 대기하면 data가 오는 것을 알아차리는 반면 국내 등 다른 페이지를 방문하면 판단을 못한다.
  - 단점을 보완할 해결법
    - 1990년대 중반에 사용했던 Static Sites 영감을 받아서 SSR 도입
    - 검색엔진 (SEO)을 위한 SSR
      - Pre-Rendering
        - 검색엔진이라는 것을 알아차린 다음 검색엔진일때에만 백엔드 서버에서 데이터 를 받아서 Html 완성해서 전달한다.
        - 일반 고객일때에는 기존 React 방식으로 준다.
      - SSR
        - 첫 방문만 전통적인 방식으로 모든 페이지를 불러온다.
        - 그 다음부터는 React 방식으로 코드 스플리팅으로 필요한 페이지들만 불러온다.
    - 코드 스플리팅 (code spliiting)
      - js 파일을 쪼개서 프론트 서버에서 해당 페이지 파일만 받아온다.
      - 프론트 서버에서 브라우저로 data없이 html js 모든 파일을 돌려주는데 모든 화면을 전부 담아서 돌려주기 때문에 비효율 적이다.
      - ex) 블로그 페이지만 불러오면 되는데 about페이지 등 방문하지도 않을 페이지들까지 불러오기 때문

- SEO 문제로 SSR with Hydration 기법으로 React + Next.JS 처음엔 SSR을 하고, 그 후 다른 페이지들에선 CSR를 이용하는 방식이다.
- 리액트를 사용한 프레임 워크이며 실무를 위해 갖춰진 것이 많다.
- 프레임워크 특성상 정해진 틀 안에서 코딩의 자유도는 떨어진다
- 가장 큰 장점은 서버사이드 렌더링이다.

- 서버사이드 렌더링(SSR) 은 언제 사용해야할까?

  - SEO 노출 필요성
  - 서버 캐싱 적용 (사용자 경험 개선) - ex) 페이지 로딩 제거
  - 반대로 언제 필요 없을까?
    - 대표적으로 admin 페이지
      - 검색엔진에 노출 될 이유가 없다.
      - 조금 느리다고해서 관리자들은 불편하겠지만 고객들 입장에서는 반응속도가 중요한 것 만큼 관리자한테 중요하지 않는다. 이럴 때 admin 페이지등 만들 때 복잡하게 생각하지말고 Next말고 React 사용한다.
      - 웬만한 B2C(기업이 소비자 상대로 행하는 인터넷 비지니스)서비스 할 때에는 Next 같은 SSR 지원하는 프레임워크를 고려해본다.

- [SSR과 CSR 참고 사이트](https://d2.naver.com/helloworld/7804182)
- Next에서 `Head` 를 지원해준다. `import Head from 'next/head';`

  <br>

## Ant Design

  <br>

```
npm i antd
npm i @ant-design/icons
```

<br>

## Redux

[next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper)

- Next에서 Redux를 붙이려면 복잡하기 때문에 간편하게 해주는 라이브러리

장 단점

- 실제로 Redux는 초보한테 좋고, MobX는 리액트 생태계를 이해하고, 자유롭게 다룰 수 있는 사람한테 좋다.
- Redux는 에러가 덜 생기는 대신 코드량이 많다.
- 생산성 측면에서는 마이너스이다.
- MobX는 코드량이 줄어드는 대신 실수를 하면 트래킹(추적)하기가 어렵다.

필요성

- 여러 컴포넌트간의 공통적인 데이터가 필요할 때
- 컴포넌트들이 기본적으로 분리되있으면, 데이터도 흩어져있을거고 흩어지지 않게 하려면 부모 컴포넌트를 두어서 데이터를 받고 자식 컴포넌트에 각각 보내줘야하는데 이런 과정들이 매번 수동적이고 복잡하다.
- 이런 과정들을 <b>중앙 데이터 역할</b> 즉 중앙에서 하나로 관리해서 컴포넌트에 보내주는 것이 Redux, MobX, Context API, swr, recoil 등이 있다.

history

- action들이 기록이 남는다.
- 기록들이 남으면 데이터들이 어떻게 변경되어 왔는지 내역들이 추적이 되어서 버그 잡기가 쉬워진다.
- action들을 거꾸로 사용할 수 있다.
  - 예를들어, 로그인을 했으면 원래 정보가 없다가 action에 의해서 정보가 생긴다.
  - redux devtool에서 뒤로가기를 하면 로그인이 풀어버린다. 다시 원하면 로그인 시킬 수 있다.
  - 데이터를 뒤로 돌렸다가 앞으로 감았다가 개발할 때 테스트하기가 좋다.

불변성 (immutability)

```
{} === {} // false

const a = {};
const b = a; // 참조관계
a === b // true
```

reducer

```
switch (action.type) {
  case 'CHANGE_NAME':
  return {
    ...state,
    name: action.data
  }
}
```

- 위 return {} 반환하는 이유는 참조관계가 안되게 하기위해서 즉 name만 변경하고 싶은것만 변경하고 새로운 객체(다른 객체)를 반환해야 한다.

- 새로운 객체를 만드는 이유는 변경한 내용들이 <b>기록이 남아서 추적</b>이 가능해진다.

...state

- ...state 대신 name, age, password 다 적지 않는 이유는 <b>메모리</b>를 아끼기 위해서

```
const nest = { b: 'c' };
const prev = { a: nest };

const next = { ...prev }

prv.a === next.a // true

prev === next // false

{} 와 {} 는 서로 다르고
{} 안에 있는 a는 서로 참조가 된다.

그래서 메모리를 아낄 수 있다.
a 까지 새로만드는 것이 아니라, a는 참조를 그대로 유지하기 때문에
```

```
{
  name: 'MoMo',
  age: 27,
  password: 123,
  posts: [{}, {}, {}]
}

...state를 하게 되면 posts: [{}, {}, {}] 는 참조가 된다.
만약에 ...state 안하고 똑같이
{
  name: action.date,
  age: 27,
  password: 123,
  posts: [{}, {}, {}],
}

전부 만들어 버리면 새로운 배열이랑 객체를 생성하게 되는데
action 기록들이 전부 남아있기 때문에 action 하나 실행 할때마다
자꾸 새로운 객체가 생성되어서 메모리에 부담이 된다.
```

- ...state 계속 유지해도 되는것은 참조를 하고 변경하고 싶은 것만 변경한다.
- 개발모드일 때 메모리 정리가 안된다.
  - history를 계속 가지고 있기 때문에
  - history 가지고있는 것 자체가 메모리에 저장되어 있다.
  - action 하나 하나 호출할 때 마다 점점 메모리가 커지는데 배포모드로 변경하면 history 보는 내역들이 필요없어져서 버리게 된다.
- 배포모드로 변경하면 histort를 중간마다 계속 버린다.
  - 메모리 정리

## dummyData Tip

- shortid
- faker

## react-virtualized를 활용한 무한 스크롤

[react-virtualized](https://github.com/bvaughn/react-virtualized)

- 수 많은 데이터가 로딩 되어있는데, 화면에는 3개만 그려주고 나머지는 메모리에 저장된다.
- 성능문제 호환

<br>

## 노드로 서버 구동

백엔드 서버와 프론트 서버 나누는 이유

- 대규모 app 대비
- 프론트는 SSR 백엔드는 API 한 컴퓨터에 두 개를 띄어도 되지만
- 만약에 프론트 서버에 요청이 1초에 1000개 가 오고 백엔드는 10개로 비대칭적으로 올 때가 있다.
- 그러면 서버가 메모리나 CPU가 부족해서 터진다.
- 대비해서 스케일링을 해준다. (컴퓨터를 복사한다 기존거를 통째로)
- 그러면 프론트 1000 만큼을 나눠 받도록 하지만 여기서 백엔드는 불필요한 낭비가 된다.
- 이러한 문제로 대규모 프로젝트 같은 경우 각 기능별로 서버로 나누어주는 경우가 많다.
- 그래야지 그 특정 기능에 데이터 요청이 많이 왔을 때 그 기능만 서버 여러대로 늘려주면 되기 떄문에
- 한 컴퓨터에다가 모든 기능을 다 넣어두면 그 서버를 스케일링할 때 모든 기능이 복사되는데 그럼 나머지 것들은 쓸모없게 되버리기 때문이다.

```
const http = require('http'); // node 에서 기본적으로 http 모듈 제공

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  if (req.method === 'GET') {
    if (req.url === '/api/posts') {
    }
  } else if (req.method === 'POST') {
  } else if (req.method === 'DELETE') {
  }

  res.write('<h1>Hollo node1</h1>');
  res.write('Hollo node2');
  res.write('Hollo node3');
  res.write('Hollo node4');
  res.end('Hello node8');
});

server.listen(3065, () => {
  console.log('서버 실행 중');
});
```

- node 런타임이 코드를 실행해서 http가 서버 역할을 하는거지 node 자체가 서버는 아니다.
- res.write 여러 줄로 이용하여 HTML로 보낼 수 있다. 하지만 비효율적이다.
- 서버쪽 라우터들도 쪼갤 필요가 있다.
- 기본 node 제공하는 http로는 코드를 깔끔하게 구현하기 힘들어서 express 프레임워크를 사용한다.
- 기본적인 원리는 createServer에서 요청 method나 url에 따라서 응답을 해준다.

## MySQL과 시퀄라이즈 연결하기

- `npm i sequelize sequelize-cli mysql2`
- `mysql2` : node와 mysql을 연결해주는 드라이버 역할이다.
- `sequelize` : sql 언어가 버거울때 자바스크립트로 조작해주는 라이브러리 (자바스크립트가 자동으로 sql언어로 변경해준다.)

- `npx sequelize init` 명령 : sequelize 셋팅완료

## CORS

원인

- (Access-Control-Allow-Origin) header가 requested resource에 없다.
  - 정상적으론 Network탭 해당 Headers에 Access-Control-Allow-Origin가 있어야 되는데 없어서 에러 발생
- 브라우저 (3060)가 다른 도메인으로 백엔드 서버(express)(3065) 요청을 보내면 <b>브라우저가 차단</b>해버린다 (CORS)
  - 브라우저에서 다른 서버 요청을 보냈을 때 발생하는 문제
  - 프론트 서버에서 즉 서버에서 서버로 요청했을때는 CORS가 안생긴다.
  - 브라우저에서 다른 도메인 서버로 보냈을때만 CORS가 생긴다.
- 3060 에서 3065로 보낼 수 있도록 허용을 해야한다.

해결1

- 브라우저(3060)에서 프론트 서버(Next)(3060)로 요청을 보낸다.
- 프록시(Proxy) 방식 : 프론트 서버에서 백엔드 서버로 요청 보내고 백엔드 서버에서 프론트 서버 응답했다가 다시 프론트 서버에서 브라우저로 응답 방식 (webpack devserver)

해결2

브라우저에서 백엔드 서버로 직접적으로 피해가는 방식 (Access-Control-Allow-Origin) header 설정

- npm i cors 미들웨어에서 처리해준다.
- cors는 보안정책이기 때문에 즉 브라우저는 사용자들이 사용하기 때문에 해커들도 있을 수 있다. 해커들이 백엔드 직접 요청날리면 위험해서 브라우저 자체가 차단하는데
  cors로 다 허용해버리면 위험할 수 있어서 origin: 'http:// 진짜 주소' 만 허용하겠다라고 설정해준다. (실무)

```
app.use(
  cors({
    // 여기선 true로 설정 localhost 개발서버에서도 요청을 허락받아야 되니깐
    origin: true, // * 대신 true설정하면 보낸 곳의 주소가 자동으로 들어가 편리
  })
);
```

## passport

SNS 로그인 전략

- [passport-kakao](http://www.passportjs.org/packages/passport-kakao/) passport-kakao 등
  - 각 각의 해당 로그인용 앱을 만들어줘야 한다. https://developers.kakao.com/
  - 로그인용 앱 만든후 passport-kakao 내용에 따라 적용한다.
- node쪽은 전부 passport로 통일 되어있다.
  - 로그인 자체는 passport일 필요는 없지만 passport 자체만 백엔드가 node여야한다.

## credentials로 쿠키 공유

- CORS처럼 서버간의 도메인이 다르면 쿠키도 전달이 안된다.
- 쿠키가 전달되어야 백엔드 서버가 요청한 사람이 누군지 아는데 내가 로그인 했더하더라도 그 다음 요청이 백엔드 서버는 누가 보내는지 모른다.

해결 방법

1. 프록시(Proxy) 방식
2. CORS Module

CORS Module 방식

- 위 CORS문제에서 브라우저(3060)에서 백엔드 서버(3065) 전달 하고싶으면 CORS가 Access-Control-Allow-Origin을 허용을 해주었다 HEADR로

- credentials: true 해주어야 쿠키가 전달이 되고, Access-Control-Allow-Origin이 true가 된다.
- 기본 값은 false이며 쿠키를 전달하고싶으면 true로 변경
- ex) 댓글 적을 때, 등록, 제거 등 axiost 에서 withCredentials: true 넣어줘야한다.
  - 항상 요청을 보낸사람이 누군지 알려주려면 쿠키를 보내준다.
  - 프론트에서는 axios withCredentials: true
  - 백엔드에서는 cors에서 credentials: true

```
sagas/index.js
// saga의 axios 요청들은 공통적으로 들어간다.
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;
```

```
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
```

## 내 로그인 정보 매번 불러오기

문제

- 새로고침 할 때 마다 매번 풀리는 현상 (사용자 로딩)
- 진짜로 로그인 풀리는 것은 아니다.
  - Cookies / connect.sid (possport랑 express 세션이 만든 쿠키)
  - 쿠키만 있으면 서버쪽에서 로그인 여부를 아는데, 새로고침 할 때 서버쪽에 전달이 안되어서 풀리는 것 처럼 보이지 실제론 쿠키를 가지고 있기 때문에 언제든지 쿠키를 서버쪽에 전달을 해주면 로그인 상태로 돌아올 수 있다.

해결시

- 로그인 상태에서 새로고침하면 풀렸다가 다시 로그인 되는 현상 (서버 재시작하면 풀리긴 한다.)
- 애초부터 브라우저 접속해서 서버로부터 데이터를 받아올 때 부터 로그인되게 하려면 서버사이드렌더링이 필요하다
- 현재 클라이언트 서버 렌더링 (NEXT에다가 SSR 미적용 상태)

## Next 빌드하기

- DB에 데이터가 안 차있어서 abuot이 안된다. (배포모드일 때)
- getStaticProps는 DB에 데이터가 차 있어야지 실제 페이지를 미리 빌드할 수 있어야지만 성공적으로 빌드가 되는데 지금 상황에선 삭제한다.
- 개발 과정을 거치면서 redux-devtool, hot-reloader 연결 및 Next가 즉석으로 코드 스플릿팅 해주는 것들을 미리 준비하는 빌드 과정이 필요하다.
- 빌드를 하면 HTML, CSS, JS 결과물이 나온다.
- 결과물을 가지고 웹 서버에 올려두면 결과물들이 실제 사용자 브라우저로 전달되는 과정을 거친다.
- 개발 서버는 느리기 때문에 개발에 필요한 것들은 전부 없애버리고 실제 필요한 것들만 남겨놓는다.
  - 용량 줄어들고, 속도 개선
- 터미널에서 `npm run build`
- 코드 변경 후 깃헙에다가 push하면 CI/CD 도구가 있는데 CI/CD는 코드에 대한 테스트도 해주고 빌드 같은것도 해준다. 중간에 에러들이있으면 알림도 해준다.
- 빌드나 테스트 해주는 CI/CD툴을 깃헙이랑 연결해놔서 깃헙에다가 push를 하면 알아서 CI/CD툴 돌아가고 빌드랑 테스트 전부 통과하면 아마존 웹 서비스 서버로 배포해주는 중간다리 역할을 해주는 것이 CI/CD툴이다.
  - ci/cd tool : jenkins, circle ci, travis ci 등이 있다.
- `npm run build`이 끝나면 각 페이지마다 총 용량이 1MB 정도만 안넘으면 한국 서비스 할 수 있다. 만약 그 이상이면 코드 스플릿팅 적용해서 `react.lazy` 또는 `suspense`가 있는데 그 기능으로 용량을 잘게잘게 쪼개주는 것이 좋다.
- λ(lamda) : getServerSideProps 있는 것들
- ● : getStaticProps 있는 것들
- λ(lamda) 랑 ● 있는 것들은 서버사이드 렌더링을 한 번씩 하는 것이다.
  - ●는 미리 HTML로 만들어져 있다. getStaticProps 쓰는 것들은 즉석에서 서버사이드 렌더링하는 것이 아니고 HTML을 미리 만들어 놓으려고 하는 것이다.
- ○ /404(존재하지 않는) 는 처음부터 서버쪽 상관없이 그냥 정적인 페이지 (처음부터 HTML)

용량 분석하기

- `npm i @next/bundle-analyzer`

Customizing The Error Page

- 404 (존재하지 않는)
  - https://nextjs.org/docs/advanced-features/custom-error-page#404-page
- 500 (서버 에러)
  - 개발모드 일 때는 에러 메세지가 빨갛게 뜨고 배포할 때는 보안에 위협되기 때문에 메시지대신 짤막하게 영어로 뜬다.
  - https://nextjs.org/docs/advanced-features/custom-error-page#500-page
  - 주의사항으로 에러 메시지는 안보여주는 것이 좋다. (보안 위협)
  - 사용자들에게는 잠시 후에 시도해보세요나 고객센터에 문의하세요 등 넣는 것이 좋다.
