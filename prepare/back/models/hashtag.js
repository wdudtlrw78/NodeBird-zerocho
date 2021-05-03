// 게시글에 들어있는 해시태그

const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: 'Hashtag',
        tableName: 'hashtags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // + mb4 = 이모티콘 저장
        sequelize, // index.js / sequlize을 연결객체를 넣어준다.
      }
    );
  }

  // associate : 관계형 데이터 베이스
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); // 작성자한테 속해있다.
  }
};
