// 사용자 정보

// mysql에서는 테이블
// sequlize에서 테이블들을 model이라고 부른다.

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const User = sequlize.define(
    'User',
    // 자동으로 소문자로되고 복수가 된다. MySQL에 users 테이블 생성
    {
      // id: {}, -> id는 안적어도 된다. mySQL에서 자동으로 1, 2, 3, 4올라간다.
      email: {
        type: DataTypes.STRING(30), // 많이 쓰이는 얘들 STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME

        // 이메일 필수 여부
        allowNull: false, // 필수
        unique: true, // 고유한 값 (중복되면 안되기 때문에)
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), // 비밀번호는 암호화하기 때문에 넉넉하게 길이를 조정한다.
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    }
  );

  // associate : 관계형 데이터 베이스
  User.associate = (db) => {
    // 어떤 관계들이 있는지 생각해봐야한다.
    // 사용자가 게시글을 작성한다고 가정
    // 사용자가 여러개의 게시글을 작성할 수 있나?? YES
    // 반대로 게시글 하나에 작성자가 여러명일 수 있나?? // 가능할 수 있지만 이 서비스에서는 NO

    // 이러한 관계를 유저와 포스트간의 1 대 다 관계

    db.User.hasMany(db.Post); // 사람이 포스트를 여러개 기질 수 있다.
    db.User.hasMany(db.Comment); // 사람이 댓글을 여러개 달 수 있다.

    // through는 테이블 이름을 변경해주고 foreignKey는 테이블에 들어있는 각각 column의 어떤 아이디이고 어떤 아이디인지 변경해서 구별해준다.
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 중간 테이블 이름 // 유저와 좋아요 버튼 관계 ( 다 대 다 관계 설명은 post.js)

    // hasMany보다 belongsTo가 더 역할이 있다.

    //belongsTo
    // 게시글이든 사용자든 전부 고유한 아이디들이 붙는다.
    // 예를들어 1번 사용자가 작성했다 그리고 3번 게시글 아래에 달린 댓글이다. db.Comment.belongsTo(db.Post);
    // 이런식으로 belongsTo가 들어가면 실제 column이 생성된다.
    // 두 개의 column 생성
    // UserId : 1,
    // PostId : 3,

    // hasMay
    // 다섯개의 게시글을 달았으면 유저에다 정보를 생성할 수 없다 왜냐하면 콤마로 구분되거나
    // 한 칸에 여러개의 정보가 들어가면 안된다.
    // SQL 할 때 엑설구조 짤 때 원칙이 한 칸에는 하나의 정보만 들어가야 되는데 아래에는 여러개 이다. Post에 대한 그래서 hasMany 는 원칙적으로 맞지않는다.
    // PostId : 1, 2, 5, 15
    // Comment :

    // hasOne
    // db 설계하기에따라 달라진다.
    // 예를들어 유저가 있고 사용자 정보라는 테이블 하나가 더 있다고 가정하면 user랑 userInfo
    // user 사용자가 있고 그 사용자에 대한 정보를 다른 테이블에 몰아놨으면 user hasOne userInfo
    // 사용자와 그 사용자에 대한 정보가 1 대 1로 엮여있다. 그 사용자에 대한 정보가 다른 사용자 정보에 엮일 수는 없다.

    // 팔로잉 팔로워
    // 같은 테이블간에도 관계가 있을 수 있다.
    // User가 있고 User 중간에 팔로우 관계 테이블
    // 같은 User 테이블이기 때문에 아이디도 같다. ex) 1 모모 / 1 모모 2 무무 / 2 무무 3 마마 / 3 마마
    // 중간테이블 안에서 팔로잉 팔로워 생성할 수 있다.
    // 이처럼 사용자와 사용자의 관계에도 팔로우관계 (다 대 다 관계)가 생긴다.
    // 핵심은 다 대 다 관계 (belongsToMany)에는 중간 테이블이 생긴다. 중간 테이블 통해서 원활하게 검색할 수 있다.
    // ex) 모모가 1 이면 모모가 팔로잉한 사람들 전부 찾아라 검색하면 팔로우 테이블에서 모모를 팔로우 하고 있는 사람들 찾아낸다.
    // 그리고 중요한 포인트 : 모모의 팔로워를 찾으라하면 먼저 팔로잉 모모를 찾고나서 그 팔로워를 찾아야한다. 그리고 무무의 팔로잉을 찾으라 하면 먼저 팔로워 무무를 찾고나서 반대 팔로잉 무무를 찾는다.
    // 서로 반대라는걸 기억해야된다.
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'FollowingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    });
    // 서로 같은 키일때는 foreignKey를 갖는다. 왜냐하면 서로 User User 테이블 생기면 누가 팔로워 팔로잉 하는지 모르니깐 key를 붙여준다.
    // 모모가 1번인데 모모를 팔로잉한 사람을 찾아라 하면 먼저 모모를 팔로워한 사람을 찾고 반대 쪽 팔로잉 모모들을 찾아야한다.
    // 그래서 먼저 찾는걸 적어줘야한다.
    // 내가 팔로잉한 사람들을 찾으려면 나를 먼저 찾아야한다. (followerId)
    // 그래서 as 를 먼저 찾고 그 반대 foreignKey를 찾는다.
  };
  return User;
};

// 1 대 1 관계 1 대 다 관계 다 대 다 관계가 있고, 포트폴리오 만들 때 서로간의 관계를 파악하기 힘들면 시퀄라이즈 관계 설정하기 댓글에 문의
