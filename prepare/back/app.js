const express = require('express');
const postRouter = require('./routes/post');
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

app.listen(3065, () => {
  console.log('서버 실행 중!');
});
