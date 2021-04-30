import { all, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
// import shortId from 'shortid';

import {
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_REQUEST,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  UNLIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  // generateDummyPost,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data); // fome data 그 대로 넣어준다. {name : data}등 감싸면 FOME DATA에서 json형식으로 바뀐다.
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  // 좋아요는 게시글의 일 부분 수정이라 patch ( 좋아요 갯수 1개 올려준다 )
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    // yield delay(1000);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data, // postId, userId
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    // yield delay(1000);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    // yield delay(1000);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  // 에러 발생 : Request path contains unescaped characters
  // 원인 : 해쉬링크가 한글이나 특수문자
  // 해결 : encodeURIComponent 감싸준다
  // encodeURIComponent : ex) 리액트 -> R%%#$)kdsakeqwe@#@#4
  // decodeURIComponent : ex ) R%%#$)kdsakeqwe@#@#4 -> 리액트
  // decodeURIComponent를 back/router/hashtag의 where에도 넣어줘야한다.

  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`); //get은 두번 째자리는 WithCredentials 이기 때문에 data 넣을 자리가 없어서 쿼리스트링 방식으로 ?key=${값} (주소의 데이터가 포함)
  // 장점이 주소만를 캐싱하면 데이터까지 캐싱이 된다. post나 put patch는 데이터 캐싱이 안되는데 get만의 이점이 data까지 캐싱할 수 있다.
}

function* loadHashtagPosts(action) {
  try {
    console.log('LoadHashtag console');
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    // yield delay(1000);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`); //get은 두번 째자리는 WithCredentials 이기 때문에 data 넣을 자리가 없어서 쿼리스트링 방식으로 ?key=${값} (주소의 데이터가 포함)
  // 장점이 주소만를 캐싱하면 데이터까지 캐싱이 된다. post나 put patch는 데이터 캐싱이 안되는데 get만의 이점이 data까지 캐싱할 수 있다.
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    // yield delay(1000);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`); //get은 두번 째자리는 WithCredentials 이기 때문에 data 넣을 자리가 없어서 쿼리스트링 방식으로 ?key=${값} (주소의 데이터가 포함)
  // 장점이 주소만를 캐싱하면 데이터까지 캐싱이 된다. post나 put patch는 데이터 캐싱이 안되는데 get만의 이점이 data까지 캐싱할 수 있다.
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    // yield delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function addPostAPI(data) {
  // data의 이름을 content 키로 지정 req.body.content
  return axios.post('/post', data); // { content: data } / FormData는 바로 data로 넣어줘야한다.
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    // yield delay(1000);

    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    // 유저 리듀서 액션 호출
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    // yield delay(1000);

    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    // 유저 리듀서 액션 호출
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    // yield delay(1000);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPost),
    fork(watchLoadPosts),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
