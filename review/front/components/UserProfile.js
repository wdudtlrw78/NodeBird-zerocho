import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, Avater, Button } from 'antd';

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          짹짹 <br />0
        </div>,
        <div key="followings">
          팔로잉 <br />0
        </div>,
        <div key="followers">
          팔로워 <br />0
        </div>,
      ]}
    >
      <Card.Meta title="MoMo" avatar={<Avater>MM</Avater>} />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  );
};

UserProfile.propTypes = {
  setIsLoggedIn: PropTypes.node.isRequired,
};

export default UserProfile;
