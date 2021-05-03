// 사용자가 남긴 댓글

const DataTypes = require('sequelize');
const { Model } = DataTypes;

// 사용자 정보 저장
module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        // UserId : 1
        // PostId : 3
      },
      {
        modelName: 'Comment',
        tableName: 'comments',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // + mb4 = 이모티콘 저장
        sequelize, // index.js / sequlize을 연결객체를 넣어준다.
      }
    );
  }

  static associate(db) {
    // associate : 관계형 데이터 베이스
    db.Comment.belongsTo(db.User); // 작성자한테 속해있다.
    db.Comment.belongsTo(db.Post); // 게시글에 속해있다.
  }
};
