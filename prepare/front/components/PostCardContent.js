import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  // 첫 번째 게시글 #해시태그 #익스프레스
  // split의 경우 정규표현식할 때 안에 ( )을 넣어줘야한다.
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              <a>{v}</a>
            </Link>
          );
        }

        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = { postData: PropTypes.string.isRequired };

export default PostCardContent;
