import { actions } from "../services/actions";

const initialState = {
  people: []
};

export const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_PEOPLE:
      const { people } = action.payload;
      return {
        ...state,
        people
      };
    case actions.DELETE_PERSON:
      return {
        ...state,
        people: state.people.filter(user => user.id !== action.payload )
      };
    default:
      return state;
  }
};

export const getEmployees = state =>
  state.people.filter(person => person.role === "employee");
export const getPeople = state => state.people;
