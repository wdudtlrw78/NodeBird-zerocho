import { HYDREATE } from 'next-redux-wrapper';

const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpdate: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

export const loginAction = (data) => ({
  type: 'LOG_IN',
  data,
});

export const logoutAction = (data) => ({
  type: 'LOG_OUT',
  data,
});

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDREATE:
      console.log('HYDRATE', action);
      return { ...state, ...action.payload };
    case 'LOG_IN':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case 'LOG_OUT':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
