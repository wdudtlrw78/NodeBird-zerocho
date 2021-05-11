export const initialState = {
  isLoggedIn: false,
  user: null,
  signUpdate: {},
  loginData: {},
};

// action creator

export function loginAction(data) {
  return {
    type: 'LOG_IN',
    data,
  };
}

export function logoutAction(data) {
  return {
    type: 'LOG_OUT',
    data,
  };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
      };
    case 'LOG_OUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
