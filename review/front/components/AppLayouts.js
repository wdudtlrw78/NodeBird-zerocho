import React from 'react';
import ProTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Col, Row } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayouts = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">
            Google
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayouts.propTypes = {
  children: ProTypes.node.isRequired,
};

export default AppLayouts;
