const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

// passport index = app.js (중앙 통제실)
module.exports = () => {
  passport.serializeUser((user, done) => {
    // 유저 정보중에서 쿠키랑 묶어줄 ex 'cxlhy' / id: 1번만 저장해주는 과정
    done(null, user.id); // 첫번 째 서버에러, 두번 째 성공
  });

  passport.deserializeUser(async (id, done) => {
    // serializeUser 로 ID만 들고있다가 라우터로 접근하게 되면 라우터 접근전에 deserializeUser 한번씩 실행해서
    // 저장했던 ID 토대로 사용자 정보를 복구해서 req.user로 만든다. 그래서 routers에서 req.user로 접근이 가능하다.
    // 로그인 성공하고나서 그 다음 요청부터 실행
    // 모모로 로그인하면 id : 1 랑 set-Cookie connect-sid 와 함께 다음요청에 보내지는데
    // 그럼 이부분이 다음 요청부터 매번 실행되서 아이디로부터 사용자 정보를 복구를 해낸다.

    // 복원할 때 id를 통해서 serializeUser(id)가 여기로 저장된다.
    // 그럼 이 id를 통해서 db에서 복원을 한다.
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user에 넣어준다.
      // 그럼 어떻게 되냐면 예를들어 router.post('/user/logout') 하면 req.user가 현재 로그인한 사람의 정보가 들어있기때문에
      // 로그인 한 뒤 부터 deserializeUser() 이 부분이 router.post('/user/logout') 실행되기전에 매 번 실행되기 때문에 req.user에 사용자 정보가 들어있다
      // 즉 게시글쓰거나 댓글 쓸 때 로그인 사용자 정보 활용한다.
    } catch (error) {
      console.error(error);
      done(error); // 마찬가지로 passport 는 next대신 done으로
    }
  });

  local();
};

// serialize는 직렬화, deserialize는 역직렬화인데요.

// 직렬화라는 것은 어떤 데이터를 다른 곳에서 사용할 수 있게 다른 포맷의 데이터로 바꾸는 것을 의미합니다.

// 지금 패스포트에서는 시퀄라이즈 객체를 세션에 저장할 수 있는 데이터로 바꾸고 있습니다.

// 반대로 역직렬화는 다른 포맷의 데이터로 바뀐 데이터를 원래 포맷으로 복구하는 것입니다.

// 세션에 저장된 데이터를 다시 시퀄라이즈 객체로 바꾸는 작업을 의미합니다.
