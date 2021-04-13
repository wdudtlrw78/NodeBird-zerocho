import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import reducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
  // 미들웨어는 dispatch가 실행될 때마다 일을 하는거고  위의 action은 dispatch가 일어날 그 당시의 action을 말한다
  // next의 역할은 미들웨어를 끝내는 일을 한다.
};

// 여기서 applyMiddleware로 loggerMiddleware를 감싸면 알아서 위 applyMiddleware함수가 dispatch나 getState같은 인자들을 넣어준다

const configureStore = (context) => {
  // 일반 redux랑 비슷하다.
  console.log(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(reducer, enhancer);
  // store.dispatch({
  //   type: "CHANGE_NICKNAME",
  //   data: "oMoM",
  // });

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
