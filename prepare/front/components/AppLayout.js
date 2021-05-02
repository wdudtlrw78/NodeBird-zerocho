import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Menu, Row, Col } from 'antd';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

// - xs : 모바일
// - sm : 태블릿
// - md : 작은 데스크탑

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); 더미데이터
  // useSelector는 npm i react-redux
  // isLoggedIn이 변경되면 알아서 AppLayouts 컴포넌트가 리렌더링 된다.

  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // redux
  // 또는 구조분해 할당도 가능
  const { me } = useSelector((state) => state.user);

  const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    // Enter키 를 누르면 onSearch 실행
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Global />
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
          <SearchInput
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
            enterButton
            style={{ verticalAlign: 'middle' }}
          />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/*target="_blank" 적용할 때 보안의 위협이 있어서 항상 rel="noreferrer noopener" 적용한다.*/}
          <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">
            Google
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
