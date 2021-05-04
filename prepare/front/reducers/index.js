import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// reducer : 차원축소 이전상태, 액션 2개를 받아서 하나로 축소하는 개념
// (이전상태, 액션) => 다음상태

// combineReducers 함수 합치는 함수

// const rootReducer = combineReducers({

// NEXT에서는 리듀서 쪼갤 때 HYDRATE 넣어주기 위해서 index 함수를 넣어준다.

// index: (state = {}, action) => {
//   switch (action.type) {
//     //  HYDRATE는 next-redux-wrapper를 쓸 때 필요한 액션. 서버쪽에서 실행된 리덕스의 결과물이 프론트에서는 HYDRATE라는 액션 이름 아래에 데이터로 전달된다.
//     case HYDRATE:
//       console.log("HYDRATE", action);
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// },

// user랑 post를 합친다.
// rootReducer가 state고, user와 post는 각각 state.user, state.post가 된다.
// user.js의 me는 state.user.me가 된다.

//   user,
//   post,
// });

// -> configuerStore

// reducer : 차원축소 이전상태, 액션 2개를 받아서 하나로 축소하는 개념
// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE: // SSR 완료될 때 호출되는 액션
      // console.log('HYDRATE', action); // 배포전 지우기
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};
export default rootReducer;
