import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  hasNotifications: false,
  countOfInboxNotifications: 0,
  hasLeavesNotifications: false,
  countOfLeavesNotifications: 0,
  hasPartialNotifications: false,
  countOfPartialNotifications: 0,
  hasRegNotifications: false,
  countOfRegNotifications: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateNotications(state, action) {
      state.hasNotifications = action.payload;
    },
    updateCountOfNotications(state, action) {
      state.countOfInboxNotifications = action.payload;
    },
    updateLeavesCount(state, action) {
      if (action.payload > 0) {
        state.hasLeavesNotifications = true;
      }
      state.countOfLeavesNotifications = action.payload;
    },
    updatePartialCount(state, action) {
      if (action.payload > 0) {
        state.hasPartialNotifications = true;
      }
      state.countOfPartialNotifications = action.payload;
    },
    updateRegCount(state, action) {
      if (action.payload > 0) {
        state.hasRegNotifications = true;
      }
      state.countOfRegNotifications = action.payload;
    },
  },
});

export const {
  updateNotications,
  updateCountOfNotications,
  updateLeavesCount,
  updatePartialCount,
  updateRegCount,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
