// 미들웨어로 라우터 검사하기

exports.isLoggedIn = (req, res, next) => {
  // 프론트에서는 me로 검사했지만 백엔드에서는 req.user 또는 패스포트에서 isAuthenticated가 내부적으로 들어있다.
  if (req.isAuthenticated()) {
    next(); // next는 지금까지 에러처리로 이용되어있지만 두 가지 사용방법이 있다.
    // 1번째는 next() 안에 적으면 에러처리 하러가고
    // 2번째는 그냥 next() 호출하면 다음 미들웨어로 이동한다.
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다');
  }
};
