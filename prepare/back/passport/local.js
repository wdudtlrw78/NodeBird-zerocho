// 로컬 로그인 전략 (Local Login );

// passport에서는 응답을 보내지 않는다.

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// index.js -> local(); 실행 역활
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // req.body 역할
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });

          if (!user) {
            // res.status(403) 으로 해주는게 아니라 done으로 넘겨준다.
            // done으로 결과를 판단 자리 중요
            // 첫번째 자리 서버에러
            // 두번째 성공
            // 세번째 클라이언트 에러
            return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
            // done은 callback 같은 거라서 1, 2, 3번째 인자가 routers/user.js passport로 전달된다.
          }
          // 비밀번호 비교
          const result = await bcrypt.compare(password, user.password); // db에 저장되어있는 비밀번호와 입력한 사용자 비밀번호 비교

          // 이메일있고, 비밀번호 일치하면 로그인 성공 그러면 두번째자리에 사용자 정보 넘겨준다.
          if (result) {
            return done(null, user);
          }

          // 일치하지 않을 때
          // 첫번째 자리는 서버에러인데 비동기 요청을하면 항상 서버에러를 발생할 수 있어서 대비를 위해 try catch문 이용한다.
          return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
