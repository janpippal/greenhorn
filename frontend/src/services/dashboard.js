import { actions } from "./actions";

export const fetchDashboard = () => async (dispatch, getState, { api }) => {
  const catalogs = await api
    .get("dashInfo")
    .then(response => {
      const { data } = response;
      return data;
    })
    .catch(response => {
      dispatch({ type: actions.SET_ERROR, payload: response.data.message });
      return;
    });
  return catalogs;
};
