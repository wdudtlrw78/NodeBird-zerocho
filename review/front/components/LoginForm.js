import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  return (
    <Form>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
      </div>
      <Input
        name="user-password"
        type="password"
        value={password}
        onChange={onChangePassword}
        required
      />
      <div>
        <Button type="primary" htmlType="submit" loading={false}>
          회원가입
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
