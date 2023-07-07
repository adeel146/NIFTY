import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  milestoneState: false,
  milestoneId: null,
  addMembersState: false,
  workLoadsList: {},
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
    setworkLoadsList(state, action) {
      if (action.payload) {
        const Result = JSON.parse(JSON.stringify(action.payload));
        Result.tasks = Result.tasks.map((task) => {
          return {
            ...task,
            duration: 2,
            isExpand: false,
          };
        });
        state.workLoadsList = Result;
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

export const {
  setworkLoadsList,
  closeMilestone,
  openMilestone,
  openAddMembersDialog,
  closeAddMembersDialog,
} = dashbordSlice.actions;
export default dashbordSlice.reducer;
