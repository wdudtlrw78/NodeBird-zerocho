import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => (
  // 첫 번째 게시글 #해시태그 #익스프레스
  // split의 경우 정규표현식할 때 안에 ( )을 넣어줘야한다.
  <div>
    {postData.split(/(#[^\s#]+)/g).map((v) => {
      if (v.match(/(#[^\s#]+)/)) {
        return (
          // (NEXT) Link prefetch false 안해놓으면 원하지도 않는데 관련 정보들 미리 다 불러온다.
          <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={v}>
            <a>{v}</a>
          </Link>
        );
      }

      return v;
    })}
  </div>
);

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;
