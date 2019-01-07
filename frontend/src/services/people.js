import { actions } from "./actions";

export const fetchPeople = () => async (dispatch, getState, { api }) => {
  await api
    .get("people")
    .then(response => {
      dispatch({ type: actions.FETCH_PEOPLE, payload: response.data });
      return;
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when loading people"
      });
      return;
    });
};

export const deletePerson = id => async (dispatch, getState, { api }) => {
  await api
    .delete("people/delete/" + id)
    .then(() => {
      dispatch({ type: actions.DELETE_PERSON, payload: id });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when deleting person"
      });
    });
};

export const addPerson = (state,history) => async (dispatch, getState, { api }) => {
  await api
    .post("people/add", {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      mobile: state.mobile,
      role_id: state.role,
      department_id: state.department,
      jobPosition_id: state.jobPosition,
      assignTasks: state.assignTasks
    })
    .then(function(response) {
      history.push("/people");
    })
    .catch(response => {
      console.log(response.response.data.message)
      dispatch({ type: actions.SET_ERROR, payload: response.response.data.message });
    });
};

export const getPersonById = (id) => async (dispatch, getState, { api }) => {
  const person = await api
  .get("people/" + id)
  .then(response => {
    return response.data.person;
  })
  .catch(error => {
    console.log(error);
    dispatch({
      type: actions.SET_ERROR,
      payload: "Failed when getting person"
    });
    return;
  });
  return person
}

export const updatePerson = (personJson, history) => async (dispatch, getState, { api } ) => {
  await api
    .put("people", personJson)
    .then(response => {
      history.push("/people")
      return;
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when updating person"
      });
      return;
    });
}
