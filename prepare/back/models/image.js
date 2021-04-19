// 게시글의 이미지

// mysql에서는 테이블
// sequlize에서 테이블들을 model이라고 부른다.

module.exports = (sequlize, DataTypes) => {
  // 사용자 정보 저장
  const Image = sequlize.define(
    'Image',
    // 자동으로 소문자로되고 복수가 된다. MySQL에 Images 테이블 생성
    {
      // id: {}, -> id는 안적어도 된다. mySQL에서 자동으로 1, 2, 3, 4올라간다.
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

  Image.associate = (db) => {};
  return Image;
};
