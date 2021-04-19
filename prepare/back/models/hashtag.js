// 게시글에 들어있는 해시태그

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const Hashtag = sequlize.define(
    'Hashtag',
    {
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

  // associate : 관계형 데이터 베이스
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post); // 작성자한테 속해있다.
  };
  return Hashtag;
};
