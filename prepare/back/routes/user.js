const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const { User, Post, Image, Comment } = require('../models'); // db.User 구조분해 { User }
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 사용자 불러오기 (새로고침 로그인 풀림 해결)
// 새로고침 할 때마다 요청
router.get('/', async (req, res, next) => {
  console.log(req.headers); // headers 안에 쿠키가 들어있다. ( 쿠키 들어있는지 터미널 확인 )
  // GET /user
  try {
    // 로그인하지 않은 상태에서 요청하면 { id: req.user.id } 에러 발생 요청 막아주기
    if (req.user) {
      // 유저가 있을때만
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          // attributes: [], // 원하는 정보만 받기
          exclude: ['password'], // 전체 데이터중에 password만 빼고 가져오겠다.
        },
        include: [
          {
            // hasMany라서 복수형 me.Posts
            model: Post,

            // me data
            // 숫자 갯수만 알아내면 되기 때문에 id만 가져오면 length 길이로 몇 개, 몇 명인지 알 수 있고 나머지 불필요한 데이터들은 안받을 수 있다.
            // 만약 팔로워 팔로잉이 수백만명이고 데이터에 전부 가득 차있으면 용량차고 모바일 시 느려지는 현상 방지
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//로그인 POST / user /login
// passport 전략 실행
// passport는 사용방법이 다르다 원래는 req, res, next가 없는 미들웨어인데 미들웨어를 확장한다(express 기법중 하나).
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // 서버에러 발생하면
    if (err) {
      console.error(err);
      return next(err);
    }

    // 클라이언트 에러발생하면
    if (info) {
      return res.status(401).send(info.reason); // 403은 금지 401은 허가되지 않음
    }

    // 성공하면
    // req.login으로 login할 수 있다.
    // passport에서 로그인할 수 있게 허락해 주는데
    // 혹시나 로그인 하는 과정에서 에러 발생하면
    // 이거는 우리 서비스 로그인하는게아니라 passport 로그인이다.
    // 우리 서비스 로그인할 때 전부 통과하면 passport 로그인을 한 번더한다.

    // 총 과정 : 프론트(loginForm) -> saga (data) -> req.body (passport.authenticate()) -> local.js (Strategy) -> 성공하면 done -> 다시 콜백 여기로 req.body(req.login)
    // passport login 시도하는데 문제없으면 status한다. req.login(user) 가 serializeUer (user, done)으로넘어간다. ->  passport/index.js serializeUser(user, done);
    // 단 passport할 때 로그인 저장이 필요하다. 이럴 때 세션이 있다. (app.js)
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // 로그인 중 에러 : Posts undefined -> me.followers, me.followings가 없기 때문
      // me(User)랑 Post 즉 사용자 테이블과 게시글 테이블의 관계에서 Post가 나오는거고
      // 사용자 테이블과 사용자 테이블의 관계에서 followers, followings가 나온다.
      // 그래서 단순히 내 정보만 불러왔을 때는 Posts, Followings, Followers 또는 내가 쓴 게시글, 내가 쓴 댓글들 이런 정보까지 안나오기 때문에 직접 넣어줘야 한다.
      // me 정보는 json(user)가 action.data로 넘어가서 reducer에 me가 된다 여기서는 user / saga에서는 action.data / reducer에서는 me
      // req.login(user) 론 부족하다 비밀번호는 더 들어있고(프론트 서버로 노출 X) Post, follower, followings는 없으니까 부족하기떄문에 다시 가져온다. (models/user)
      // 비밀번호 없는 내가 원하는 사용자 정보 data 선택해서 가져오기
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          // attributes: [], // 원하는 정보만 받기
          exclude: ['password'], // 전체 데이터중에 password만 빼고 가져오겠다.
        },
        include: [
          {
            // hasMany라서 복수형 me.Posts
            model: Post,
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });

      // 사용자 정보를 프론트로 넘겨준다.
      // 로그인할 때 내부적으로 res.setHeader('Cookie', 'cxlhy'); 프론트로 보내준다. 그리고 알아서 세션도 연결해준다.
      // (Network 탭 Headers확인가능 set-Cookie connect-sid) set-Cookie를 통해서 서버가 모모인지 아닌지 판단한다.
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

//회원가입 POST /user/
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    // 중복체크
    const exUser = await User.findOne({
      where: {
        email: req.body.email, // 기존에 저장된 사용자중에 프론트에서 보낸 email 같은 이메일 사용자가 있으면 저장하기 (없으면 null 반환)
      },
    });

    // status (MDN)
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

// 만약 로그인이 안한사람이 로그아웃 접근할 수 도 있다.
// 주소는 공개되어있기 때문에 주수들과 post인지 get인지 알면 그리고 설사 모른다고 해도 계속 바꿔서 시도할 수 도있기 때문에 맞출 수 도 있다.
// 로그인 한 사람인지 안한사람인지 보안을 위해 검사를 해줘야한다.
// middlewares.js
// 코드 실행은 위에서 아래로 왼쪽에서 오른쪽으로 실행된다.
// isLoggedIn으로 검사한다 -> middlewares.js -> next() 실행해서 다음 미들웨어로 이동 ex) 위에 /login , isNotLoggedIn의 passport.authenticate() 실행 ->
// 실행중에 next(err) 에러가나면 바로 err처리 미들웨어로 간다. app.js 의 맨아래 app.listen() 과 app.use('/user', userRouter); 등 사이에 내부적으로 에러처리 미들웨어가 존재한다.
router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    User.update(
      {
        // update : 수정
        nickname: req.body.nickname, // 프론트에서 받은 닉네임
      },
      {
        where: { id: req.user.id }, // 내 아이디
      }
    );
    res.status(200).json({ nickname: req.body.nickname }); // action.data부분
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followers', isLoggedIn, async (req, res, next) => {
  // GET /user/1/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send('존재하지 않는 사용자 입니다');
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10), // limit만큼 가져온다 -> profile의 swr
    }); // // 팔로워 목록 가지고 온다.
    res.status(200).json(followers); // action.data부분 / 상대방 ID
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {
  // GET /user/1/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send('존재하지 않는 사용자 입니다');
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10), // limit만큼 가져온다 -> profile의 swr
    }); // // 팔로잉 목록 가지고 온다.
    res.status(200).json(followings); // action.data부분 / 상대방 ID
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 남의정보 가져오기
router.get('/:userId', async (req, res, next) => {
  // GET /user/1
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        // attributes: [], // 원하는 정보만 받기
        exclude: ['password'], // 전체 데이터중에 password만 빼고 가져오겠다.
      },
      include: [
        {
          // hasMany라서 복수형 me.Posts
          model: Post,

          // me data
          // 숫자 갯수만 알아내면 되기 때문에 id만 가져오면 length 길이로 몇 개, 몇 명인지 알 수 있고 나머지 불필요한 데이터들은 안받을 수 있다.
          // 만약 팔로워 팔로잉이 수백만명이고 데이터에 전부 가득 차있으면 용량차고 모바일 시 느려지는 현상 방지
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      // 시퀄라이즈에서 불러온 data는 JSON이 아니라서 JSON으로 데이터 형식으로 변경
      const data = fullUserWithoutPassword.toJSON();
      // about.js
      // length로 덧붙여 넣어야지 id들이 안들어있어서 보안에 안정적이다. (개인정보 침해예방)
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/posts', async (req, res, next) => {
  //GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 페이지 네이션
      // 초기 로딩이 아닐 때
      // lastId 다음 꺼 불러와야한다.
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId 보다 작은 id 10개를 불러와라(op)
      // Op = operator
      // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // 10개만 가져와라 (ex 스크롤 내리면 10개 씩)

      // 댓글 정렬: order / DESC : 내림차순
      order: [['createdAt', 'DESC']],
      include: [
        {
          // 정보를 가져올 때는 항상 완성을 해서 가져와야 한다. (작성자 정보도 같이 다 넣어서)
          model: User,
          attributes: ['id', 'nickname'], // include의 User는 비밀번호는 빼야한다. (보안)
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              // 댓글의 작성자
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 유저
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post, // 리트윗 게시물
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error;
    next(error);
  }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('존재하지 않는 사용자 입니다');
    }
    await user.addFollowers(req.user.id); // 내 ID 팔로우 추가
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // action.data부분 / 상대방 ID
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('존재하지 않는 사용자 입니다');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // action.data부분
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // 팔로워한 사람을 찾고
    if (!user) {
      res.status(403).send('존재하지 않는 사용자 입니다');
    }
    await user.removeFollowings(req.user.id); // 내가 그 사람을 차단하는거랑 팔로워한 사람이 나를 언팔로우하는거랑 똑같다
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // action.data부분
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

// 중요!!
// 에러발생 followers, followings GET 404 에러
// 원인 : 미들웨어(라우터도 미들웨어)는 위에서 부터 아래로 왼쪽도 오른쪽으로 실행된다.
// User foillowings가 있으면 걸린다. 해서 router.get('/:userId')에서 먼저 걸린다. 와일드 카드 /: 이 부분을 와일드 카드 or params라고 불린다.
// params or 와일드카드 부분은 맨 아래에 적어야 한다.
