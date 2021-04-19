// 게시글에 들어있는 해시태그

// mysql에서는 테이블
// sequlize에서 테이블들을 model이라고 부른다.

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const Hashtag = sequlize.define(
    'Hashtag',
    // 자동으로 소문자로되고 복수가 된다. MySQL에 Hashtags 테이블 생성
    {
      // id: {}, -> id는 안적어도 된다. mySQL에서 자동으로 1, 2, 3, 4올라간다.
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // + mb4 = 이모티콘 저장
    }
  );

  Hashtag.associate = (db) => {};
  return Hashtag;
};
