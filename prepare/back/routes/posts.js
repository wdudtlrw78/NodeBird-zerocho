const express = require('express');
const { Op } = require('sequelize');

const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

// GET /posts 여러개 가져오기
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
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
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
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
      // offset: 0, // 원하는 구간만 가져온다 ex) 0 ~ 10 게시글 가져와라 100이면 101 ~ 110
      // 실무에선 Limit과 offset을 잘 사용하지 않는다.
      // 단점 : 중간에 사람이 게시글 지우거나 추가한다고 가정하면 (id가 높을수록 최신)
      // 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
      // 20 ~ 11 까지 가져왔는데 사람이 로딩중에 게시글 1개를 생성해버리면
      // offset과 Limit이 꼬인다. offset : 10으로 바뀌면 10개를 건너뛰어서 12까지 건너뛰고 11부터 2까지 추가로 가져온다
      // 그래서 offset은 추가 삭제시 문제 발생해서 lastId로 많이 쓰인다.
      // where { id: lastId } 적용하면 Limit: 10 이고 lastId가 11되니까 그 다음 꺼 부터 10개 가져온다.

      // 게시판같은 경우 틀이 고정이 되어있기때문에 offset Limit 적용해도 문제는 없지만,
      // 베스트는 lastId로 페이지 네이션 구현할 때 (인피니트 스크롤링, 게시판 등) lastId Limit 방식
    });

    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error;
    next(error);
  }
});

module.exports = router;
