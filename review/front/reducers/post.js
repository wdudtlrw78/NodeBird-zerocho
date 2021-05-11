export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: '모모',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          src: './images/KakaoTalk_20210221_202520730.jpg',
        },
        {
          src: './images/KakaoTalk_20210221_202520730.jpg',
        },
      ],
      Contents: [
        {
          User: {
            nickname: 'MOMO',
          },
          content: 'TEST!',
        },
        {
          User: {
            nickname: 'MAMA',
          },
          content: 'TEST2!',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST';

export const addPost = {
  type: ADD_POST,
};

export const dummyPost = {
  id: 2,
  content: '더미데이터 입니다',
  User: {
    id: 1,
    nickname: '모모',
  },
  images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
