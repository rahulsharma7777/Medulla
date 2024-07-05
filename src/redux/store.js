import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../redux/slice/loginSlice";
import loaderSlice from "../redux/slice/loaderSlice";
import editmodeSlice from "../redux/slice/editmodeSlice";
import shiftSlice from "../redux/slice/shiftSlice";
import notificationsSlice from "../redux/slice/notificationsSlice";
const store = configureStore({
  reducer: {
    login: loginReducer,
    loader: loaderSlice,
    editMode: editmodeSlice,
    shiftDetails: shiftSlice,
    notification: notificationsSlice,
  },
});

export default store;
