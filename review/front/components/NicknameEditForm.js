import React, { useMemo } from 'react';
import { Form, Input } from 'antd';

//const a = () => {} 이렇게 되면 마지막 {}가 객체인지 함수의 몸통인지 헷갈립니다.
//a = () => {} 이런 경우 함수의 몸통이고
//() => ({}) 이런 경우 {} 객체를 return하는 겁니다.
const NicknameEditForm = () => {
  const style = useMemo(
    () => ({
      marginBottom: '20px',
      border: '1px solid #d9d9d9',
      padding: '20px',
    }),
    []
  );
  return (
    <Form style={style}>
      <Input.Search addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
};

export default NicknameEditForm;
