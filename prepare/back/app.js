const express = require('express');
const cors = require('cors');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
// 터미널 -> node app -> Error: Unknown database 'react-nodebird' -> npx sequelize db:create
// -> node app (시퀄라이즈가 만들어놨떤 js 작성보고서 sql문으로 변경해서 실행) -> mySQL db테이블 생성

app.use(
  cors({
    origin: true, // * 대신 true설정하면 보낸 곳의 주소가 자동으로 들어가 편리
  })
);
// app = express인데 express 서버에다가 뭔가를 장착(use)을 해준다. (use 안에 들어가는 것들이 미들웨어이다. 순서도 매우 중요하다.)
// json, urlencoded 역할이 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할을 한다.
// 위에서 아래순으로 실행되기 때문에 req.body를 먼저 찾고 라우터 들을 찾아야되기 때문에 꼭 라우터 들 보다 위에 적어줘야 한다.
// json과 urlencoded의 차이점은 json은 프론트에서 json형식으로 데이터를 보냈을 때 그 json 형식의 데이터를 req.body로 넣어주고
// urlencoded는 form submit을 했을 때 urlencoded방식으로 넘어온다. 그래서 form 했을 때 req.body안에 데이터 넣어준다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/', (req, res) => {
  res.send('hello api');
});

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.use('/post', postRouter); // /post prefix로 붙인다.
app.use('/user', userRouter); // /user prefix로 붙인다.

app.listen(3065, () => {
  console.log('서버 실행 중!');
});
