import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Avatar, Popover, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

dayjs.locale('ko');
dayjs.extend(relativeTime);

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [CommentFormOpend, setCommentFormOpend] = useState(false);
  const id = useSelector((state) => state.user.me?.id); // optional channing id가 없으면 undifined 반환

  const onLike = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합나디');
    }

    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합나디');
    }

    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      alert('로그인이 필요합나디');
    }
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  // 의문점: user.js의 initialState 내 정보가 me인데 어떻게 state.me가아니고 state.user.me가 되는지
  // reducer/index.js에 rootReducer가 state고, user와 post는 각각 state.user, state.post가 된다.
  // user.js의 me는 state.user.me가 된다.
  const liked = post.Likers.find((v) => v.id === id);

  const onRetweet = useCallback(() => {
    if (!id) {
      // 서버에서도 무조건 막아줘야한다 (프론트도 막아줘야 한다.)
      alert('로그인이 필요합나디');
    }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        // cover : antd 에서 내장된 옵션
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {/*로그인 했고 내 아이디가 게시글 작성자 아이디와 같으면 수정 삭제 가능 다르면 신고 버튼 */}
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        {/* 리트윗인 경우 모양이좀 다르다. Card안에 Card 넣어주기*/}
        {/* 지금 post가 리트윗 post이면 RetweetId가 있을거고 Retweet 객체도 있을 것이다. */}
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <div style={{ float: 'right' }}>{dayjs(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={
                // (NEXT) Link prefetch false 안해놓으면 원하지도 않는데 관련 정보들 미리 다 불러온다.
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{dayjs(post.createdAt).fromNow()}</div>
            <Card.Meta
              avatar={
                // (NEXT) Link prefetch false 안해놓으면 원하지도 않는데 관련 정보들 미리 다 불러온다.
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {CommentFormOpend && (
        <div>
          {/* post 넘겨주는 이유 : 댓글을 작성할 때 댓글은 게시글에 속해있다. 
        어떤 게시글에 댓글을 달건지 정보 게시글의 Id 가 필요하다.*/}
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    // (NEXT) Link prefetch false 안해놓으면 원하지도 않는데 관련 정보들 미리 다 불러온다.
                    <Link href={`/user/${item.User.id}`} prefetch={false}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    UserId: PropTypes.number,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
