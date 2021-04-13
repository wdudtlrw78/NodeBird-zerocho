import { all, fork, put, takeEvery, delay } from "redux-saga/effects";
// import axios from "axios";

// function logInAPI(data) {
//   // 주의할점 뒤에 *붙이면 에러발생
//   // 서버에 요청을 보낸다.
//   // 그 요청의 결과 값을 logIn 함수에서 받는다

//   // 그리고 요청만 보내는게 아니라 실제 data를 넣어서 로그인을 해줘야한다.
//   // 그 data는
//   // watchLogIn() 에서 'LOG_IN_REQUEST'할 때 type: 'LOG_IN_REQUEST', data: 로그인과 관련된 데이터가 있다.
//   // 그러면 LOG_IN_REQUEST에 대한 action(logIn)자체가 logIn(action) 매개변수로 전달이 된다.
//   // action.type 하면 login request가 나올거고 action.data하면 로그인 데이터가 들어있다.
//   // action.data 를 logIn(action)에서 const result = yield call(logInAPI, action.data); logInAPI에 넣어준다.
//   // 그러면 logInAPI(data)로 들어간다.
//   return axios.post("/api/login", data);
// }

// // function logOutAPI() {
// //   return axios.post("/api/logout");
// // }

// // function addPostAPI() {
// //   return axios.post("/api/post");
// // }

function* logIn() {
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
    // const result = yield call(logInAPI, action.data); // 서버가 아직 없기 때문에 call 하면 에러가 발생한다. 없는 서버에 요청해서 그래서 가짜로 만든다.
    yield delay(1000); // delay: setTimeout 역할 // 서버 구현되기 전까지 dealy로 비동기적인 효과를 준다.
    yield put({
      type: "LOG_IN_SUCCESS",
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      // data: err.response.data,
    });
  }
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: "LOG_OUT_SUCCESS",
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      // data: err.response.data,
    });
  }
}

function* addPost() {
  try {
    // const result = yield call(addPostAPI);
    yield delay(1000);
    yield put({
      type: "ADD_POST_SUCCESS",
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE",
      // data: err.response.data,
    });
  }
}

// 비동기 action creator 함수
// thunk은 비동기 action creator을 직접 실행했지만
// saga에서는 비동기 action creator 이벤트 리스너와 같은 역할을 한다.
// "LOG_IN_REQUEST 액션이 들어오면, login() 제너레이터 힘수를 실행한다.
function* watchLogin() {
  yield takeEvery("LOG_IN_REQUEST", logIn);
  // watchLogin 액션이 실행 될 때까지 기다리겠다.
  // watchLogin 액션이 실행되면, logIn 실행한다.

  // take 단점은 1회용이다. 로그인하고 로그아웃 한 번씩 가능하고 그 다음부터 로그인할 때 사라져버린다.
  // 해결 방법: while (true) 인피니트 방법으로 무한 개념이다. while문 대체로 takeEvery, takeLatest로 많이 쓰인다.

  // while take는 동기적으로 동작하지만,
  // takeEvery는 비동기로 동작하는 차이점이 있다.

  // takeLatest는 예를 들어 클릭 10번 했을 때 9번 앞은 무시되고 마지막만 실행해준다.
  // takeLatest 마지막 실행 기준 : 예를들어 Add_POST_REQUEST 한 다음에 10초 뒤에 Add_POST_REQUEST 다시 하면 앞에 것은
  // 이미 완료되었는데 뒤에꺼는 앞에 것을 취소하는 것이 아니라 앞에 거는 놔두고 뒤에것을 실행한다.
  // 만약에 동시에 두 개가 들어갔다고 하면 앞의 것과 뒤에 것도 같이 로딩중인데 로딩중인 것 (완료되지 않은 것)은 없애 버린다.
  // takeLatest한다고 해서 앞에 이미 게시글 작성했던 것들도 다 취소 되는게 아니라 완료 된거는 가만히 놔두고 동시에 로딩중인것만 앞에것들 취소한다.
  // front에서만 마지막꺼 실행이 된다.
  // 만약 클릭을 실수로 두번 하면 백엔드 서버로 요청 2번 간다. 그리고 응답도 2번 온다. 그러면 게시글이 2번 똑같은게 올라간다. 이런게 원하는 것이 아니라
  // takeLatest 요청했을 때 앞에 것들은 취소한다. 그러면 게시글도 앞에 것들은 안보인다. 이것들의 치명적인 단점이 응답을 취소하는거지 요청을 취소하지 않는다.
  // 결론은 서버에는 데이터 가 앞에 것들 다 저장된다. 그래서 서버 쪽 에서 반드시 똑같은 데이터가 연달에 저장 여부 를 점검을 해야한다.
  // 해결 방법: yield throttle("LOG_IN_REQUEST", logIn, 2000); 2초동안은 딱 한 번만 실행해준다. 즉 요청 보내는 것까지 초 제한을 둔다. (특수한 경우에만 쓰인다. 보통은 takeLatest 서버 쪽에서 검사를 해서 중복된 데이터 막도록 검증하는 편이다.)

  // takeLeding은 반대로 첫번째 것만 실행
  // 디바운싱과 쓰로틀링이 비슷한데 차이점은 출처 : 제로초 블로그 https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa
  // takeLatest는 모두 호출하고 이전게 완료되기 전에 다음게 호출되면 이전걸 취소한다. 주로 스크롤을 올리거나 내릴 때
  // debounce는 호출되고 일정 시간이 지나야만 실제로 실행되고 시간이 지나기전에 재호출되면 이전게 취소된다. 주로 ajax 검색
}

function* watchLogOut() {
  yield takeEvery("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
  yield takeEvery("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
  // all 은 배열은 받는데 배열에 들어있는 것들을 동시에 실행 해준다.
  // fork는 함수를 실행
  // call도 함수를 실행할 수 있다.
  // fork랑 call의 차이점: fork는 비동기 함수 호출 call은 동기 함수 호출
  // 공통점 : non-blocking, 비동기
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}

// 질문 모음

//1. takeEvery나 takeLatest에 while(true) 와 같은 기능이 있다고 이해했는데 맞는건가요?
// 1. 맞습니다.

// 2. yield delay나 yield put 같은 것은 왜 사라지지 않나요?
// 2. 사라집니다. 질문의 의도를 추측해보자면 take은 한 번 실행하고 더이상 실행이 안되는데 delay랑 Put은 왜 다음번에 되는지를 물어보시는 것 같은데요.
// watch 함수는 한 번만 실행되고 login* 함수같은 것은 매번 실행돼서 그렇습니다. 하나의 함수 안에서 더이상 호출이 안 되는거지 새로운 함수가 또 실행되면 새 함수 안에서는 실행됩니다.

// 3. yield는 제너레이터함수에서 호출할때마다 하나씩 끊어서 반환되는 것이라 이해했는데 왜 yield delay후에 yield put이 실행되는 건가요? takeLatest이펙트의 기능인가요..?
// 3. 왜 연달아서 실행되는 지를 물어보시는 거면, saga가 내부적으로 계속 next를 호출해서 그렇습니다.
