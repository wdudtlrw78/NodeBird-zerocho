const express = require('express');
const { Post, Hashtag, Image, Comment, User } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/:hashtag', async (req, res, next) => {
  //GET /hashtag/노드
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      // 페이지 네이션
      // 초기 로딩이 아닐 때
      // lastId 다음 꺼 불러와야한다.
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId 보다 작은 id 10개를 불러와라(op)
      // Op = operator
      // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // 10개만 가져와라 (ex 스크롤 내리면 10개 씩)

      // 댓글 정렬: order / DESC : 내림차순
      order: [['createdAt', 'DESC']],
      include: [
        {
          // 해쉬테그의 where을 여기다 적어준다.
          // include한얘에서 조건을 적용할 수 있다.
          // 그러면 위의 것들 where 조건도 적용되고 여기 where도 동시에 만족하는 얘가 선택된다 (hashtag 검색)
          // 유저의 게시글 검색, 해쉬태그 검색어 게시글 검색어도 될 수 있다.
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        },
        {
          // 정보를 가져올 때는 항상 완성을 해서 가져와야 한다. (작성자 정보도 같이 다 넣어서)
          model: User,
          attributes: ['id', 'nickname'], // include의 User는 비밀번호는 빼야한다. (보안)
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              // 댓글의 작성자
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 유저
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post, // 리트윗 게시물
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error;
    next(error);
  }
});

module.exports = router;
