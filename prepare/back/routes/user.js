const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // db.User 구조분해 { User }

const router = express.Router();

// POST /user/
router.post('/', async (req, res, next) => {
  try {
    // 중복체크
    const exUser = await User.findOne({
      where: {
        email: req.body.email, // 기존에 저장된 사용자중에 프론트에서 보낸 email 같은 이메일 사용자가 있으면 저장하기 (없으면 null 반환)
      },
    });
    // status
    // 200번대 성공
    // 300번대 리다이렉트
    // 400번대 클라이언트 에러
    // 500번대 서버 에러
    if (exUser) {
      // sagas/user.js -> signUp error와 연결
      return res.status(403).send('이미 사용중인 아이디입니다.'); // return 안하면 아래꺼까지 실행된다.
      // 안붙이면 res.send 아래에도 res.send 응답을 두 번 보내져서 에러가 난다. 응답은 무조건 한번만 보내야된다. (요청이 한 번이니까 응답도 한 번)
      // 만약 응답 두 번 보내져서 에러 메시지는 can't set headers already sent
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 암호화 할때 1초 정도 걸리는 숫자로 맞춰주자.
    await User.create({
      // body는 어디에서부터 올까?? page/signUp -> dispatch({ data: {email password ....}}) -> saga의 data 전달의 data는 -> 서버 (백엔드)에서는 req.body로 받는다.
      // 대신 req.body는 그냥 쓸 수 있는게아니라 app.js에서 다른 라우터들, listen보다 위에 app.use(express.json()); , app.use(express.urlencoded({ extended: true })); 적어줘야 한다.
      // app = express인데 express 서버에다가 뭔가를 장착(use)을 해준다.
      // json, urlencoded 역할이 프론트에서 보낸 데이터를 req.body 안에다가 넣어주는 역할을 한다.
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword, // 비밀번호를 그대로 적어주면 보안의 위협이된다. // 비밀번호 암호화 라이브러리 설치 npm i bcrypt
    });
    res.status(201).send('ok'); // 201 : 잘 생성됨
  } catch (error) {
    console.error(error);
    next(error); // status 500 / next 통해서 error을 보내면 그 에러들이 한 방에 처리된다. 에러가 발생하면 express가 브라우저(클라이언트)로 "너 이런에러가 발생했다고 알려준다"
  }
});

module.exports = router;
