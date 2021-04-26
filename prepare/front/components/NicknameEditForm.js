import React, { useCallback } from 'react';
import { Form, Input } from 'antd';

//const a = () => {} 이렇게 되면 마지막 {}가 객체인지 함수의 몸통인지 헷갈립니다.
//a = () => {} 이런 경우 함수의 몸통이고
//() => ({}) 이런 경우 {} 객체를 return하는 겁니다.
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="닉네임"
        enterButton="수정"
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default NicknameEditForm;
