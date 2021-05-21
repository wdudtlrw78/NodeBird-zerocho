import { all, fork, put, takeEvery, delay } from 'redux-saga/effects';
// import axios from 'axios';

// function logInAPI(data) {
//   return axios.post('/api/login', data);
// }

// function logOutAPI() {
//   return axios.post('/api/logout');
// }

// function addPostAPI() {
//   return axios.post('/api/post');
// }

function* logIn(action) {
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      type: 'LOG_IN_SUCCESS',
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data,
    });
  }
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: 'LOG_OUT_SUCCESS',
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data,
    });
  }
}

function* addPost() {
  try {
    // const result = yield call(addPostAPI);
    yield delay(1000);
    yield put({
      type: 'ADD_POST_SUCCESS',
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: err.response.data,
    });
  }
}

function* watchLogin() {
  yield takeEvery('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
  yield takeEvery('LOG_OUT_REQUEST', logOut);
}

function* watchAddPost() {
  yield takeEvery('ADD_POST_REQUEST', addPost);
}

export default function* rootSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}
