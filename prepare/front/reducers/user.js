import produce from 'immer';

export const initialState = {
  loadMyInfoLoading: false, // 나의 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,

  loadUserLoading: false, // 유저 정보 가져오기 시도중
  loadUserDone: false,
  loadUserError: null,

  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,

  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,

  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,

  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,

  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,

  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,

  // loadFollowingsLoading: false, // 팔로잉 가져오기 시도중
  // loadFollowingsDone: false,
  // loadFollowingsError: null,

  // loadFollowersLoading: false, // 팔로워 가져오기 시도중
  // loadFollowersDone: false,
  // loadFollowersError: null,

  removeFollowerLoading: false, // 팔로워 제거
  removeFollowerDone: false,
  removeFollowerError: null,

  me: null,
  userInfo: null,
  // signUpdata: {},
  // loginData: {},
};

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

// export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
// export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
// export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

// export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
// export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
// export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

// 게시글은 포스트 리듀서 나에 대한 정보는 유저 리듀서에 있는데 문제가
// 포스트 리듀서에 만약 내가 글을 쓰고 추가가 되면
// 유저 리듀서에 내가 쓴 게시글에도 id가 추가되어야지 내가 쓴 게시글이 1에서 2로 올라야된다.
// 그리고 포스트 리듀에서 있는 글 중 내가 쓴 게시글 중 1가지 삭제했을 때 유저 리듀서에 있는
// Posts 데이터 Id에서 1개가 빠져야지 게시글이 2에서 1로 줄어야 된다.
// 그걸 어떻게 해줘야할까??
// 포스트 리듀서에는 포스트 리듀에만 건들 수 있고 유저 리듀서도 마찬가지이다.
// 게시글을 등록/삭제 할 때 유저 리듀서도 변경할 때
// 원리를 이해해야 한다.
// 유저 리듀서 상태를 변경하고 싶으면 상태는 액션을 통해서만 변경할 수 있다.
// 그러면 액션을 만들어 주면 된다.

// 포스트 사가 에서 유저 사가 호출할 수 있다.

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME'; // 내 게시글 추가 액션
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME'; // 내 게시글 제거 액션

// thunk
// export const loginAction = (data) => {
//   return (dispatch, getState) => {
//     const state = getState();
//     dispatch(loginRequestAction());
//     axios
//       .post("/api/login")
//       .then((res) => {
//         dispatch(loginSuccessAction(res.data));
//       })
//       .catch((err) => {
//         dispatch(loginFailureAction(err));
//       });
//   };
// };

// const dummyUser = (data) => ({
//   ...data,
//   nickname: '모모',
//   id: 1,
//   Posts: [{ id: 1 }],
//   Followings: [{ nickname: '무무' }, { nickname: '파파' }],
//   Followers: [{ nickname: '무무' }, { nickname: '파파' }],
// });

// action creator
export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  data,
});

export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      // case REMOVE_FOLLOWER_REQUEST:
      //   draft.removeFoloowerLoading = true;
      //   draft.removeFoloowerError = null;
      //   draft.removeFoloowerDone = false;
      //   break;
      // case REMOVE_FOLLOWER_SUCCESS:
      //   draft.removeFoloowerLoading = false;
      //   draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId);
      //   draft.removeFoloowerDone = true;
      //   break;
      // case REMOVE_FOLLOWER_FAILURE:
      //   draft.removeFoloowerLoading = false;
      //   draft.removeFoloowerError = action.error;
      //   break;
      // case LOAD_FOLLOWINGS_REQUEST:
      //   draft.loadFollowingsLoading = true;
      //   draft.loadFollowingsError = null;
      //   draft.loadFollowingsDone = false;
      //   break;
      // case LOAD_FOLLOWINGS_SUCCESS:
      //   draft.loadFollowingsLoading = false;
      //   draft.me.Followings = action.data;
      //   draft.loadFollowingsDone = true;
      //   break;
      // case LOAD_FOLLOWINGS_FAILURE:
      //   draft.loadFollowingsLoading = false;
      //   draft.loadFollowingsError = action.error;
      //   break;
      // case LOAD_FOLLOWERS_REQUEST:
      //   draft.loadFollowersLoading = true;
      //   draft.loadFollowersError = null;
      //   draft.loadFollowersDone = false;
      //   break;
      // case LOAD_FOLLOWERS_SUCCESS:
      //   draft.loadFollowersLoading = false;
      //   draft.me.Followers = action.data;
      //   draft.loadFollowersDone = true;
      //   break;
      // case LOAD_FOLLOWERS_FAILURE:
      //   draft.loadFollowersLoading = false;
      //   draft.loadFollowersError = action.error;
      //   break;
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        draft.loadMyInfoDone = false;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.me = action.data;
        draft.loadMyInfoDone = true;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.userInfo = action.data;
        draft.loadUserDone = true;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followError = null;
        draft.followDone = false;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.me.Followings.push({ id: action.data.UserId });
        draft.followDone = true;
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowError = null;
        draft.unfollowDone = false;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId);
        draft.unfollowDone = true;
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.me = action.data;
        draft.logInDone = true;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutError = null;
        draft.logOutDone = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpError = null;
        draft.signUpDone = false;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.chnageNicknameLoading = true;
        draft.chnageNicknameError = null;
        draft.chnageNicknameDone = false;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname;
        draft.chnageNicknameLoading = false;
        draft.chnageNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: [{ id: action.data }, ...state.me.Posts],
      //   },
      // };
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: state.me.Posts.filter((v) => v.id !== action.data),
      //   },
      // };
      default:
        break;
    }
  });

export default reducer;
