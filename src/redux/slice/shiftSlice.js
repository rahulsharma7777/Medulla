import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shift: "",
};
const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    storeShiftDetails(state, action) {
      state.shift = action.payload;
    },
    clearShiftDetails(state, action) {
      state.shift = "";
    },
  },
});
export const { storeShiftDetails, clearShiftDetails } = shiftSlice.actions;
export default shiftSlice.reducer;
