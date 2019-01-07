import { actions } from "./actions";

export const fetchCatalogs = () => async (dispatch, getState, { api }) => {
  const catalogs = await api
    .get("catalogs")
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
