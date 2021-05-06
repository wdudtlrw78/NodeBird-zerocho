import React from 'react';
import ProTypes from 'prop-types';
import Link from 'next/link';

const AppLayouts = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/">
          <a>노드버드</a>
        </Link>
        <Link href="/profile">
          <a>프로필</a>
        </Link>
        <Link href="/signup">
          <a>회원가입</a>
        </Link>
      </div>
      {children}
    </div>
  );
};

AppLayouts.protoTyeps = {
  children: ProTypes.node.isRequired,
};

export default AppLayouts;
