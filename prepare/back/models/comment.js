// 사용자가 남긴 댓글

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const Comment = sequlize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    // UserId : 1
    // PostId : 3
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // + mb4 = 이모티콘 저장
    }
  );

  // associate : 관계형 데이터 베이스
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 작성자한테 속해있다.
    db.Comment.belongsTo(db.Post); // 게시글에 속해있다.
  };
  return Comment;
};
