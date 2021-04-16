import shortId from 'shortid';

export const initialState = {
  // 더미데이터

  // 서버쪽에서 이런식으로 데이터를 준다.
  // 속성들 같은경우(id, User, content 등등) 백엔드 개발자한테 미리 물어보면 좋다. 어떤식으로 줄 것인지
  // 또는 프론트엔드 개발자가 백엔드 개발자한테 이런식으로 줘도된다고 요청해두된다.

  // id나 content는 게시글 자체의 속성이고
  // User Images Comments는 다른 정보들과 합쳐서 주기 때문에 대문자로 해준다.
  // 서버쪽에서 데이터를 어떻게 보낼 것인지 미리 물어보면 좋다.

  // 대문자 얘들은 서버에서 주는 얘들인데 ID가 고유하게 필요하다 ( 나중에 Key로 판단 )
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
          id: shortId.generate(),
          src:
            'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        },
        {
          id: shortId.generate(),
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
        {
          id: shortId.generate(),
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: 'MoMo',
          },
          content: 'Test!',
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: 'PaPa',
          },
          content: '두근두근',
        },
      ],
    },
  ],

  imagePaths: [], // 이미지 업로드할 때 필요한 데이터 저장소
  addPostLoading: false, // 게시글 추가가 완료됬을 때 true
  addPostDone: false,
  addPostError: null,

  removePostLoading: false, // 게시글 삭제가 완료됬을 때 true
  removePostDone: false,
  removePostError: null,

  addCommentLoading: false, // 댓글 추가가 완료됬을 때 true
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

// action // 동적으로 필요하면 action creator 사용
export const addPost = (data) => ({
  // 상수로 빼면 오타가 줄어든다.
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  // 상수로 빼면 오타가 줄어든다.
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  // 더미 데이터
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: '모모',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  // 더미 데이터
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: '모모',
  },
});

// 이런식으로 미리 리듀서부터 만들어 준다. 화면은 중요하지 않고 데이터를 미리 구성하고 액션 구성해서 리듀서 작성한다.
// 화면은 작성한 데이터 기준으로 작성한다.
// 서버 개발자와 의사소통이 되지않으면 한 번에 만들기가 어렵다.
// 예를들어 User, Images 등이 소문자로 바뀐다거나 등 그래서 처음에 리듀서에 대해 미리 합의를 봐서 커뮤니케이션이 중요하다.

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost(action.data), ...state.mainPosts], // dummyPost를 앞에다 넣어야 게시글 쓰자마자 위에서부터 추가된다.
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        addPostLoading: false,
        addPostError: action.error,
      };
    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      };
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      };
    case REMOVE_POST_FAILURE:
      return {
        removePostLoading: false,
        removePostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        (v) => v.id === action.data.postId
      );
      const post = { ...state.mainPosts[postIndex] };
      post.Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = post;
      return {
        ...state,
        mainPosts,
        // mainComments: [dummyPost, ...state.mainComments], // dummyComment를 앞에다 넣어야 게시글 쓰자마자 위에서부터 추가된다.
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
