import { actions } from '../services/actions';

const initialState = {
  isError: false,
  message: null
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_ERROR:
      return {
        ...state,
        isError: true,
        message: action.payload
      };
    case actions.DISMISS_ERROR:
      return {
        ...state,
        isError: false,
        message: null
      };

    default:
      return state;
  }
};

export const getError = state => state.message;

export const getIsError = state => state.isError;
