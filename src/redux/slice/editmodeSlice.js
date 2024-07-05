import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEdit: false,
  isDelete: false,
  isLoad: false,
};

const editmodeSlice = createSlice({
  name: "editmode",
  initialState,
  reducers: {
    changeMode(state) {
      state.isEdit = !state.isEdit;
    },
    editMode(state) {
      state.isDelete = !state.isDelete;
    },
    loadMode(state) {
      state.isLoad = !state.isLoad;
    },
  },
});
export const { changeMode, editMode, loadMode } = editmodeSlice.actions;
export default editmodeSlice.reducer;
