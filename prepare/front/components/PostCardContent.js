import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({ postData, editMode, onCancelUpdate, onChangePost }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  }, []);

  return (
    // 첫 번째 게시글 #해시태그 #익스프레스
    // split의 경우 정규표현식할 때 안에 ( )을 넣어줘야한다.
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>
              수정
            </Button>
            <Button type="danger" onClick={onCancelUpdate}>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v) => {
          if (v.match(/(#[^\s#]+)/)) {
            return (
              // (NEXT) Link prefetch false 안해놓으면 Link 하나하나들을 미리 다 홈페이지로 만들려고 하기 때문에 서버에 무리간다.
              // 단, 단일 게시글 볼 때에는 /post/2 이런거 미리 prefetch true 해두면 좋다.
              // true할 떄랑 false 구분 할 필요가 있다.
              <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={v}>
                <a>{v}</a>
              </Link>
            );
          }

          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onCancelUpdate: PropTypes.func.isRequired,
  onChangePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
