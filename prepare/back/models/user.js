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
  User.associate = (db) => {};
  return User;
};
