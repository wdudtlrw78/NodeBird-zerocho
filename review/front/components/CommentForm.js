import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import useInput from '../hooks/useInput';

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);

  const [commentText, onChangeCommentText] = useInput('');
  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
  }, [commentText]);
  return (
    <Form onFinish={onSubmitComment}>
      {/* Form.Item 감싸면 자식 인풋에 일일이 onChange를 안붙이고 Form에서 다 컨트롤이 가능하다.
        하지만, 현재 예제는 안 감싸는게 적절하다.
      */}
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button type="primary" htmlType="submit">
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
