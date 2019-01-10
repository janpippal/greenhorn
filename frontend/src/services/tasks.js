import { actions } from "./actions";

export const fetchTasks = () => async (dispatch, getState, { api }) => {
  await api
    .get('tasks')
    .then(response => {
      dispatch({ type: actions.FETCH_TASKS, payload: response.data });
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when loading tasks"
      });
      return;
    });
};

export const updateTaskState = (taskId, updatedState, userId) => async (dispatch, getState, { api }) => {
  let newState = { newState: updatedState, user_id: userId };
  await api
    .patch("tasks/" + taskId, newState)
    .then(response => {
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when changing task state"
      });
      return;
    });
};

export const addTask = (taskJson,history) => (dispatch, getState, { api }) => {
    api
    .post("tasks/add",taskJson)
    .then(response => {
      history.push('/tasks')
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when adding task"
      });
      return;
    });
};

export const getTaskById = (id) => async (dispatch, getState, { api }) => {
    const task = await api
    .get("tasks/" + id)
    .then(response => {
      return response.data.task;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when getting task"
      });
      return;
    });
    return task

};

export const updateTask = (taskJson, history) => async (dispatch, getState, { api }) => {
  await api
    .put("tasks", taskJson)
    .then(response => {
      history.push("/tasks")
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when updating task"
      });
      return;
    });
};

export const updateTaskWithFiles = (taskJson) => async (dispatch, getState, { api }) => {
  await api
    .put("tasks/upload", taskJson)
    .then(response => {
      return;
    })
    .catch(error => {
      dispatch({
        type: actions.SET_ERROR,
        payload: "Failed when updating task"
      });
      return;
    });
};
