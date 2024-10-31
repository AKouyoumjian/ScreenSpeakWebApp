import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../profile/ProfileReducer";
import UserReducer from "../login/UserReducer";

const store = configureStore({
  reducer: {
    profile: ProfileReducer,
    UserReducer,
  },
});

export default store;
