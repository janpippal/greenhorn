import { actions } from '../services/actions';

const initialState = {
  authenticated: false,
  user: [],
  token: null
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      const userData = action.payload;
      return {
        ...state,
        user: userData.user,
        token: userData.token,
        authenticated: true,
      };
    case actions.LOGIN_FAILED:
      return {
        ...state,
        authenticated: false,
      };
    case actions.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        authenticated: false,
      };

    default:
    return state;

  }
}

export const getToken = state => state.token;
export const getIsAuthenticated = state => state.authenticated;
export const getUser = state => state.user;
