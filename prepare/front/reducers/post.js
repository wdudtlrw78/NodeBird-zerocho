import shortId from 'shortid';
import produce from 'immer';
import faker from 'faker';

export const initialState = {
  // 더미데이터

  // 서버쪽에서 이런식으로 데이터를 준다.
  // 속성들 같은경우(id, User, content 등등) 백엔드 개발자한테 미리 물어보면 좋다. 어떤식으로 줄 것인지
  // 또는 프론트엔드 개발자가 백엔드 개발자한테 이런식으로 줘도된다고 요청해두된다.

  // id나 content는 게시글 자체의 속성이고
  // User Images Comments는 다른 정보들과 합쳐서 주기 때문에 대문자로 해준다.
  // 서버쪽에서 데이터를 어떻게 보낼 것인지 미리 물어보면 좋다.

  // 대문자 얘들은 서버에서 주는 얘들인데 ID가 고유하게 필요하다 ( 나중에 Key로 판단 )
  mainPosts: [],

  imagePaths: [], // 이미지 업로드할 때 필요한 데이터 저장소

  // 데이터가 수백만게 있다고 하면 사람들은 보다 지친다. 그럼 데이터가 80개 밖에 없다면 80개 다 보고나서 데이터가 불러올때가 없을 때 대비
  hasMorePost: true, // 처음 (0개) 일 때는 가져오려는 시도 를 해야한다.

  loadPostsLoading: false, // 로딩
  loadPostsDone: false,
  loadPostsError: null,

  addPostLoading: false, // 게시글 추가
  addPostDone: false,
  addPostError: null,

  removePostLoading: false, // 게시글 삭제
  removePostDone: false,
  removePostError: null,

  addCommentLoading: false, // 댓글 추가
  addCommentDone: false,
  addCommentError: null,
};

export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

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

// const dummyPost = (data) => ({
//   // 더미 데이터
//   id: data.id,
//   content: data.content,
//   User: {
//     id: 1,
//     nickname: '모모',
//   },
//   Images: [],
//   Comments: [],
// });

// const dummyComment = (data) => ({
//   // 더미 데이터
//   id: shortId.generate(),
//   content: data,
//   User: {
//     id: 1,
//     nickname: '모모',
//   },
// });

// 이런식으로 미리 리듀서부터 만들어 준다. 화면은 중요하지 않고 데이터를 미리 구성하고 액션 구성해서 리듀서 작성한다.
// 화면은 작성한 데이터 기준으로 작성한다.
// 서버 개발자와 의사소통이 되지않으면 한 번에 만들기가 어렵다.
// 예를들어 User, Images 등이 소문자로 바뀐다거나 등 그래서 처음에 리듀서에 대해 미리 합의를 봐서 커뮤니케이션이 중요하다.

// 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 (불변성 지키면서)
// immer는 불변성 신경안써도 된다.
// state 이름이 draft로 바뀐다. draft는 불변성 상관 없이 막 변경해도 된다. 그럼 immer가 알아서
// 불변성 지키면서 다음 상태로 만들어 준다.
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = action.data.concat(draft.mainPosts); // generateDummyPost(10)이면 기존 10개 + 더미데이터 10 = 20개 된다. 즉 10개씩 불러온다.
        draft.hasMorePost = draft.mainPosts.length < 50;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
        // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
        // const post = { ...state.mainPosts[postIndex] };
        // post.Comments = [dummyComment(action.data.content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = post;
        // return {
        //   ...state,
        //   mainPosts,
        //   addCommentLoading: false,
        //   addCommentDone: true,
        // };
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
