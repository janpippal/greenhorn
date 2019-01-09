import { actions } from "./actions";

export const fetchTemplates = () => async (dispatch, getState, { api }) => {
  await api
    .get("templates")
    .then(response => {
      dispatch({ type: actions.FETCH_TEMPLATES, payload: response.data });
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when loading templates"
      });
      return;
    });
};

export const addTemplate = (templateJson, history) => async (dispatch, getState, { api }) => {
  await api.post("templates/add", templateJson)
  .then(() => {
    history.push("/templates");
  })
  .catch(error => {
    dispatch({
      type: actions.SET_ERROR,
      payload: "Failed when adding template"
    });
    return;
  })
};

export const fetchAssignedTemplates = () => async (dispatch, getState, { api }) => {
  await api
    .get("templates/assignedTemplates")
    .then(response => {
      dispatch({ type: actions.FETCH_ASSIGNED_TEMPLATES, payload: response.data });
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when loading assigned templates"
      });
      return;
    });
  }

export const assignTemplate = (job_position_id,templatesIds) => async (dispatch, getState, { api }) => {
await api
  .post("templates/assignTemplates", {
    job_position_id: job_position_id,
    templatesIds: templatesIds
  })
  .then(() => {
    dispatch({ type: actions.ASSIGN_TEMPLATE });
    return;
  })
  .catch(error => {
    dispatch({
      type: actions.SET_ERROR,
      payload: "Failed when assigning template"
    });
    return;
  });
};


export const unassignTemplate = (job_position_id,template_id) => async (dispatch, getState, { api }) => {
await api
  .delete("templates/assignedTemplates?job_position_id=" + job_position_id + "&template_id=" +  template_id)
  .then(() => {
    dispatch({ type: actions.UNASSIGN_TEMPLATE });
    return;
  })
  .catch(error => {
    dispatch({
      type: actions.SET_ERROR,
      payload: "Failed when unassigning template"
    });
    return;
  });
  };
