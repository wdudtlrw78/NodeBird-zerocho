const express = require('express'); // node 에서 기본적으로 http 모듈 제공

// node 런타임이 코드를 실행해서 http가 서버 역할을 하는거지 node 자체가 서버는 아니다.
// express도 내부적으로 http 쓰기 때문에 서버를 돌릴 수 있다.

const app = express();

// app.get -> 가져오다
// app.post -> 생성하다
// app.put -> 전체 수정 ex) 아예 통째로 엎어 씌울떄
// app.delete -> 제거
// app.patch -> 부분 수정 ex) 사용자 정보가 있는데 닉네임만 변경하고 싶을 때
// app.options -> 찔러보기
// app.head -> 헤더만 가져요기(헤더/ 바디) (여기선 사용 X)

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  // 여기는 서비스 따라 달라서 백엔드와 협의를 잘해야 한다.
  // 백엔드 개발자가 어떤 데이터를 줘야되는지 협의를 하고
  // 백엔드 개발자들은 이러한 라우터들을 만들어 놓는게 주 역할이다.
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

// post랑 delete 요청하기
// 브라우저 주소창은 get 요청만 되고 이외의 요청들은 postman툴 사용
app.post('/api/post', (req, res) => {
  res.json({ id: 1, content: 'hello' });
});

app.delete('/api/post', (req, res) => {
  res.send({ id: 1 });
});

app.listen(3065, () => {
  console.log('서버 실행 중');
});

// favicon.ico 는 브라우저 자체가 요청한다. (탭 아이콘)
// res.end는 마지막에만 쓴다.

// param req = 브라우저나 프론트서버에서 온 요청에 대한 정보
// param res = 응답에 대한 정보

// res.write, res.end 등 red를 사용 = 응답을 보내고 싶을 때
// req.url, req.method = 요청이 뭔지에 대한 정보를 얻고싶을 때

// res.write로 HTML로 보낼 수 있다. 하지만 이런식으로 줄 구분하면 비효율적이다.
// 서버쪽에 라우터들도 다 쪼갤 필요가 있다.
// 기본 node 제공하는 http로는 코드를 깔끔하게 쪼개기 힘들어서 express 프레임 워크를 사용한다.

// 기본적인 원리는 createServer 곳에서 요청 method나 url에 따라서 응답을 해준다.

// 프론트서버나 브라우저가 요청을 보내면 응답을 해준다. (서버의 기본)
// 요청을 받고 응답을 보낸다.
// 요청 한 번당 응답 한 번
// 아예 안보내도 안된다. 무조건 보내야되고 한 번 요청받고 한 번 응답 보내고 ( 응답을 안 보내면 특정 시간(30초 정도) 후에 브라우저가 자동으로 응답 실패로 처리한다. )

// 만약 여러개의 데이터가 필요하면
// 방법은 다양하지만
// 한 번 요청을 보내서 여러개의 데이터를 동시에 다 묶어서 한 번에 응답을 한다거나
// 요청을 여러번 보내서 거기에 각각 조금씩 응답을 여러번 하거나
// 왜냐하면 요청과 응답은 1 : 1 비율 되야하기 때문에

// node하면서 실수하는 것이 응답을 두 번 보내는 것이다.
// ex) if으로 응답 두번 보내는 것 (res.end를 두 번 사용 X )
