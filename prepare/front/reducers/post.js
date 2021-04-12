export const initialState = {
  // 더미데이터

  // 서버쪽에서 이런식으로 데이터를 준다.
  // 속성들 같은경우(id, User, content 등등) 백엔드 개발자한테 미리 물어보면 좋다. 어떤식으로 줄 것인지
  // 또는 프론트엔드 개발자가 백엔드 개발자한테 이런식으로 줘도된다고 요청해두된다.

  // id나 content는 게시글 자체의 속성이고
  // User Images Comments는 다른 정보들과 합쳐서 주기 때문에 대문자로 해준다.
  // 서버쪽에서 데이터를 어떻게 보낼 것인지 미리 물어보면 좋다.
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "모모",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src:
            "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "MoMo",
          },
          content: "Test!",
        },
        {
          User: {
            nickname: "PaPa",
          },
          content: "두근두근",
        },
      ],
    },
  ],

  imagePaths: [], // 이미지 업로드할 때 필요한 데이터 저장소
  postAdded: false, // 게시글 추가가 완료됬을 때 true
};

const ADD_POST = "ADD_POST";

// action // 동적으로 필요하면 action creator 사용
export const addPost = {
  // 상수로 빼면 오타가 줄어든다.
  type: ADD_POST,
};

const dummyPost = {
  // 더미 데이터
  id: 2,
  content: "더미데이터 입니다.",
  User: {
    id: 1,
    nickname: "모모",
  },
  Images: [],
  Comments: [],
};

// 이런식으로 미리 리듀서부터 만들어 준다. 화면은 중요하지 않고 데이터를 미리 구성하고 액션 구성해서 리듀서 작성한다.
// 화면은 작성한 데이터 기준으로 작성한다.
// 서버 개발자와 의사소통이 되지않으면 한 번에 만들기가 어렵다.
// 예를들어 User, Images 등이 소문자로 바뀐다거나 등 그래서 처음에 리듀서에 대해 미리 합의를 봐서 커뮤니케이션이 중요하다.

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // dummyPost를 앞에다 넣어야 게시글 쓰자마자 위에서부터 추가된다.
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
