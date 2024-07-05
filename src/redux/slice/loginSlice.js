import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  error: null,
  user: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure(state, action) {
      state.isLoggedIn = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.error = null;
      state.token = null;
      state.user = "";
    },
  },
});

export const { loginSuccess, loginFailure, logout } = loginSlice.actions;
export default loginSlice.reducer;
