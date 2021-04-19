// 게시글의 이미지

module.exports = (sequlize, DataTypes) => {
  const Image = sequlize.define(
    'Image',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글
    }
  );

  // associate : 관계형 데이터 베이스
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); // 게시글에 속해있다.
  };
  return Image;
};
