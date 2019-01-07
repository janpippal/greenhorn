import { actions } from "../services/actions";

const initialState = {
  templates: [],
  assignedTemplates: []
};

export const templatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TEMPLATES:
      const { templates } = action.payload;
      return {
        ...state,
        templates
      };
    case actions.FETCH_ASSIGNED_TEMPLATES:
      const { assignedTemplates } = action.payload;
      return {
        ...state,
        assignedTemplates
      };
    default:
      return state;
  }
};

export const getTemplates = state => state.templates;
export const getAssignedTemplates = state => state.assignedTemplates;
