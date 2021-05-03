'use strict';

const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development'; // 환경변수
const config = require('../config/config')[env];
const db = {};

// mySQL2 (드라이버)가 config.database, config.username, config.password 설정 정보 보내줘서 연결 할 수 있게 도와준다.
// sequelize가 Node랑 MySQL를 연결해준다.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// db 객체안에 각각의 모델들을 집어넣어주고 실행한다.
db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  // 반복문 돌면서 각각의 데이터 관계(associate) 실행해준다.
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
// 여기까지 시퀄라이즈 모델들 다 등록완료 끝이 아니고 express에서 시퀄라이즈 등록해줘야한다. (app.js)
