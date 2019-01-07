import { actions } from './actions';

export const dismissError = () => (dispatch, getState) => {
  dispatch({ type: actions.DISMISS_ERROR });
  return
};
