const express = require('express');

// 게시글 작성, 댓글 작성하는 것도 로그인 여부 파악해야한다.
const { isLoggedIn } = require('./middlewares');
const { Post, User, Image, Comment } = require('../models');
const { post } = require('./posts');

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
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'], // include의 User는 비밀번호는 빼야한다. (보안)
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'], // include의 User는 비밀번호는 빼야한다. (보안)
        },
        {
          model: User, // 좋아요 누른 유저
          as: 'Likers',
          attributes: ['id'],
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
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'], // include의 User는 비밀번호는 빼야한다. (보안)
        },
      ],
    });

    // 프론트로 돌려주기 -> saga -> addComment result
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  // 관계형 Method 제공 (공통) post.addUser , post.getUser, post.setUser, post.removeUser 유저 생성, 유저 가져오기, 유저 수정, 유저 제거 (models/Post.associate)
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  // DELETE /post/1
  try {
    await Post.destroy({
      // 제거할 때 쓰인다. destroy : 파괴하다
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 내가 쓴 게시글이어야 한다.
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) }); // params는 문자열이기 때문에 parseInt로 감싸준다
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
