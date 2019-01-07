import { actions } from "./actions";

export const login = (email, password, history) => (
  dispatch,
  getState,
  { api }
) => {
  api
    .post("auth", {
      email: email,
      password: password
    })
    .then(response => {
      setToken(response.data);
      dispatch({ type: actions.LOGIN_SUCCESS, payload: response.data });
      api.defaults.headers.common["Authorization"] = JSON.parse(
        localStorage.getItem("user")
      ).token;
      history.push("/dashboard");
      return;
    })
    .catch(error => {
      dispatch({ type: actions.SET_ERROR, payload: "Login failed" });
      dispatch({ type: actions.LOGOUT });
      return;
    });
};

export const setToken = token =>
  localStorage.setItem("user", JSON.stringify(token));

export const removeToken = () => localStorage.removeItem("user");

export const logout = () => (dispatch, getState) => {
  removeToken();
  dispatch({ type: actions.LOGOUT });
};
