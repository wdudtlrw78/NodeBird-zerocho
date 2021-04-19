'use strict';

const Sequelize = require('sequelize');
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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
