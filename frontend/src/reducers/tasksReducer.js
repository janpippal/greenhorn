import { actions } from '../services/actions';

const initialState = {
  tasks: [],
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TASKS:
      const { tasks } = action.payload;
      return {
        ...state,
        tasks
      };
    default:
      return state;
  }
};

export const getTasks = state => state.tasks;
