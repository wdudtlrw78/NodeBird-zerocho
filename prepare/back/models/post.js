// 게시글 정보

// mysql에서는 테이블
// sequlize에서 테이블들을 model이라고 부른다.

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const Post = sequlize.define(
    'Post',
    // 자동으로 소문자로되고 복수가 된다. MySQL에 Posts 테이블 생성
    {
      // id: {}, -> id는 안적어도 된다. mySQL에서 자동으로 1, 2, 3, 4올라간다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // + mb4 = 이모티콘 저장
    }
  );

  Post.associate = (db) => {};
  return Post;
};
