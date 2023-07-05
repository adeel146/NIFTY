import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  milestoneState: false,
  milestoneId: null,
  addMembersState: false,
};

const dashbordSlice = createSlice({
  name: "dashboard_slice",
  initialState: initialState,
  reducers: {
    openMilestone(state, action) {
      state.milestoneState = true;
      if (action.payload) {
        state.milestoneId = action.payload;
      }
    },
    closeMilestone(state) {
      state.milestoneState = false;
      state.milestoneId = null;
    },
    openAddMembersDialog(state) {
      state.addMembersState = true;
    },
    closeAddMembersDialog(state) {
      state.addMembersState = false;
    },
  },
});

export const { closeMilestone, openMilestone, openAddMembersDialog, closeAddMembersDialog } = dashbordSlice.actions;
export default dashbordSlice.reducer;
