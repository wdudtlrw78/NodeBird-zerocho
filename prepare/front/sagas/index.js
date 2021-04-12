import { all, fork, call, take, put } from "redux-saga/effects";
import axios from "axios";

function logInAPI(data) {
  // 주의할점 뒤에 *붙이면 에러발생
  // 서버에 요청을 보낸다.
  // 그 요청의 결과 값을 logIn 함수에서 받는다

  // 그리고 요청만 보내는게 아니라 실제 data를 넣어서 로그인을 해줘야한다.
  // 그 data는
  // watchLogIn() 에서 'LOG_IN_REQUEST'할 때 type: 'LOG_IN_REQUEST', data: 로그인과 관련된 데이터가 있다.
  // 그러면 LOG_IN_REQUEST에 대한 action(logIn)자체가 logIn(action) 매개변수로 전달이 된다.
  // action.type 하면 login request가 나올거고 action.data하면 로그인 데이터가 들어있다.
  // action.data 를 logIn(action)에서 const result = yield call(logInAPI, action.data); logInAPI에 넣어준다.
  // 그러면 logInAPI(data)로 들어간다.
  return axios.post("/api/login", data);
}

function logOutAPI() {
  return axios.post("/api/logout");
}

function addPostAPI() {
  return axios.post("/api/post");
}

function* logIn(action) {
  // 그 요청의 결과 값을 logIn 함수에서 받는다

  // 성공 결과는 result.data,
  // 실패 결과는 err.response.data 에 담겨져 있다.

  // put은 dispatch와 같은 개념이다.

  // fork랑 call의 차이점: fork는 비동기 함수 호출 call은 동기 함수 호출
  // 공통점 : non-blocking, 비동기
  // call을 하면 logInAPI() return 할떄까지 기다려서(await) result에 넣어주는데
  // fork를 하면  요청 보내버리고 결과 기다리는 것 없이(promise없이) 바로 다음꺼 호출해버린다.
  // call은 axios.post('/api/login)).then(() =>)
  // fork는 axios.post('/api/login))
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
    yield put({
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

function* addPost() {
  try {
    const result = yield call(addPostAPI);
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE",
      data: err.response.data,
    });
  }
}

// 비동기 action creator 함수
// thunk은 비동기 action creator을 직접 실행했지만
// saga에서는 비동기 action creator 이벤트 리스너와 같은 역할을 한다.
// "LOG_IN" 액션이 들어오면, login() 제너레이터 힘수를 실행한다.
function* watchLogin() {
  yield take("LOG_IN_REQUEST", logIn);
  // watchLogin 액션이 실행 될 때까지 기다리겠다.
  // watchLogin 액션이 실행되면, logIn 실행한다.
}

function* watchLogOut() {
  yield take("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
  yield take("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
  // all 은 배열은 받는데 배열에 들어있는 것들을 동시에 실행 해준다.
  // fork는 함수를 실행
  // call도 함수를 실행할 수 있다.
  // fork랑 call의 차이점: fork는 비동기 함수 호출 call은 동기 함수 호출
  // 공통점 : non-blocking, 비동기
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}
