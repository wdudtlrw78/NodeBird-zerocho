// 게시글의 이미지

const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        src: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: 'Image',
        tableName: 'images',
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글
        sequelize, // index.js / sequlize을 연결객체를 넣어준다.
      }
    );
  }

  // associate : 관계형 데이터 베이스
  static associate(db) {
    db.Image.belongsTo(db.Post); // 게시글에 속해있다.
  }
};
