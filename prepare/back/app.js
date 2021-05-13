const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config(); // dotev는 .env 치환되서 들어간다. (config/config.json -> config.js 변경 후 module.exports)
const app = express();

// 터미널 -> node app -> Error: Unknown database 'react-nodebird' -> npx sequelize db:create
// -> node app (시퀄라이즈가 만들어놨떤 js 작성보고서 sql문으로 변경해서 실행) -> mySQL db테이블 생성
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

if (process.env.NODE.ENV === 'production') {
  // 배포일 때 우분투에서 원격 추가 (nginx revers proxy 쓰기 때문에)
  // nginx revers proxy는 강의 설명 초반 확인
  app.set('trust proxy', 1);

  app.use(morgan('combined')); // 배포모드일 때는 좀더 log가 자세해져서 실제 접속자 ip도 알 수 있으며 디도스나 해킹시도 할 수 있으면 차단할 수 도있다.
  app.use(hpp()); // Node에서 production 서버일 때는 hpp 랑 helmet은 필수이다 (보안)
  app.use(helmet()); // npm i pm2 cross-env helmet hpp
  app.use(
    cors({
      origin: 'http://nodemomobird.com', // * 대신 true설정하면 보낸 곳의 주소가 자동으로 들어가 편리
      credentials: true, // 쿠키도 같이 전달
    })
  );
} else {
  app.use(morgan('dev')); // 프론트에서 백엔드 요청 보낼 때 어떤 요청들 보냈는지 기록 (백엔드에서 디버깅하기 편리)
  app.use(
    cors({
      origin: 'http://localhost:3060', // * 대신 true설정하면 보낸 곳의 주소가 자동으로 들어가 편리
      credentials: true, // 쿠키도 같이 전달
    })
  );
}

// static : 합쳐준다 - > __dirname: 현재 폴더 (back) + '/uploads' 대신 path.join으로 쓰인다. 맥이나 리눅스에서는 / 대신 \ 쓰여서 운영체제에따라 다르므로 운영체제에 맞게 자동으로 path.join 쓴다.
// 첫번째 인자의 / 경로가 localhost:3065/ 가 된다. /images이면 localhost:3065/images 가 된다. -> postForm/img src 경로에 맞게 쓰면된다.
app.use('/', express.static(path.join(__dirname, 'uploads')));

// app = express인데 express 서버에다가 뭔가를 장착(use)을 해준다. (use 안에 들어가는 것들이 미들웨어이다. 순서도 매우 중요하다.)
// json, urlencoded 역할이 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할을 한다.
// 위에서 아래순으로 실행되기 때문에 req.body를 먼저 찾고 라우터 들을 찾아야되기 때문에 꼭 라우터 들 보다 위에 적어줘야 한다.
// json과 urlencoded의 차이점은 json은 프론트에서 json형식(axios)으로 데이터를 보냈을 때 그 json 형식의 데이터를 req.body로 넣어주고
// urlencoded는 form submit을 했을 때 urlencoded방식으로 넘어온다. 그래서 form 했을 때 req.body안에 데이터 넣어준다.
app.use(express.json());
// multer = 주로 이미지나, 파일 app.js보단 각 라우터마다 필요할 때 import한다.
app.use(express.urlencoded({ extended: true }));

// 쿠키/ 세션 : 로그인하면 브라우저랑 서버랑 같은 정보를 들고 있어야한다.
// 브라우저 3060랑 백엔드 3065 다른 서버이므로 같은 정보를 들고있지않다.
// data공유가 저절로 되는게아니라 지금까지 data받아오려면 전부 직접 받아왔다. 다시 보내주고
// 이런식으로 로그인하면 누가 로그인했는지 직접 브라우저나 프론트서버로 보내줘야 한다.
// 이때, 백엔드서버 (email, nickname, password)등 data 정보 들어있으면  통쨰로 브라우저로 보내주면 비밀번호가 들어있기때문에 보안에 취약하다.
// data 정보를 보내주는 대신에 난독화 해서 보내준다. 실제 정보대신에 랜덤한 토큰(쿠키)
// 서버쪽에도 똑같이 랜덤한 토큰이랑 연결되어있다. (서버 세션)
// 앞으로 요청 할 때 브라우저는 게시글 쓰든 댓글을 쓰든 쿠키에다가 랜덤 토큰 넣어줘서 백엔드 서버로 보내주면
// 백엔드 서버는 요청에서 쿠키를 읽어서 파악한다 (세션).
// passport 로그인할 때 문제가 백엔드 서버쪽 정보들이 통쨰로 다 들고있으면 너무 무겁다. (메모리 차지)
// passport에서 생각한게 백엔드 서버쪽에서 ID만 매칭해놓으면('cxlhy' / 1번 ID) db에서 저장되어있기때문에 db의 Id 1번이면 1번 정보 다 가져올 수 있게
// 그럼 다시 정보들을 서버에 복구하고 보내주는 방식
// 나중에는 아예 세션 저장용 DB로 redis를 사용한다고 한다.
app.use(cookieParser('nodebirdsecret'));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, // secret: 브라우저로 쿠키 랜덤한 문자열 보내준다했는데 사실 데이터 기반으로 만들어낸 문자열이다.
    // secret이 해킹당하면 데이터가 노출될 수 있다. nodebirdsecret 키를 알면 정보들이 노출되기 떄문에 꽁꽁 숨겨놔야한다.
    // dotenv : 소스코드에 secret이 있으면 만약 소스코드가 해커에게 털렸다고 가정하면 그러면 비밀번호까지 다 노출된다.
    // 특히 config 파일에서 db 정보도 다 날라가기 때문에 이런것들은 따로 관리한다. (.env) npm i dotenv

    // proxy: true, // 배포일 때 우분투에서 원격 true 변경 (nginx revers proxy 쓰기 때문에)
    cookie: {
      httpOnly: true,
      secure: false, // 배포일 때 우분투에서 원격 true 변경
      domain: process.env.NODE_ENV === 'production' && '.nodemomobird.com',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello nodemomobird');
});

app.get('/', (req, res) => {
  res.send('hello api');
});

app.use('/posts', postsRouter); // posts 여러개 가져오기
app.use('/post', postRouter); // /post prefix로 붙인다.
app.use('/user', userRouter); // 회원가입 /user prefix로 붙인다.
app.use('/hashtag', hashtagRouter); // hashtag 가져오기

// app.use((err, req, res, next) => {
// 에러 처리 미들웨어 : 내부적으로 들어있지만 커스텀으로 쓸 때는 에러 페이지를 따로 표시하고싶다던가 어떤 정보는 빼고 하고싶다던가 등 사용
// next(err) 정보 자체가 모두 에러 처리 미들웨어로 넘어가고 전부다 프론트서버로 넘어가기 때문에 그 기본 역할을 바꾸고싶으면 커스텀한다.
// })

if (process.env.NODE.ENV === 'production') {
  app.listen(80, () => {
    console.log('서버 실행 중!');
  });
} else {
  app.listen(3065, () => {
    console.log('서버 실행 중!');
  });
}
