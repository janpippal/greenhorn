import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer } from "../reducers/userReducer";
import { errorReducer } from "../reducers/errorReducer";
import { tasksReducer } from "../reducers/tasksReducer";
import { peopleReducer } from "../reducers/peopleReducer";
import { templatesReducer } from "../reducers/templatesReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"]
};

export const createRootReducer = () => {
  const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    tasks: tasksReducer,
    people: peopleReducer,
    templates: templatesReducer
  });

  return persistReducer(persistConfig, rootReducer);
};
