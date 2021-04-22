const express = require('express');

// 게시글 작성, 댓글 작성하는 것도 로그인 여부 파악해야한다.
const { isLoggedIn } = require('./middlewares');
const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    // 프론트로 돌려주기 -> saga -> addPost result
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  // POST /post/1/comment
  try {
    // 악성 사용자가 10으로 바꾸고 삭제하거나 댓글 달 수 있기에 꼼꼼하게 검사
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      // return 꼭 붙이기 센드가 두 번 실행되지 않게하기 위해 요청 1번에 응답 1번
      // return 안 붙이면 밑에 json까지 send 주의
      return res.status(403).send('존재하지 않는 게시글입니다');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      serId: req.user.id,
    });
    // 프론트로 돌려주기 -> saga -> addComment result
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => {
  // DELETE /post
  res.send({ id: 1 });
});

module.exports = router;
