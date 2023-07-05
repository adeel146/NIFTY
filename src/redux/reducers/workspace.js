import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaces: [],
  activeWorkspace: null,
};

export const name = "workspace";

const workspaceSlice = createSlice({
  initialState,
  name,
  reducers: {
    workspaceGetSuccess: (state, action) => {
      state.workspaces = action.payload;
    },
    workspaceGetByIdSuccess: (state, action) => {
      state.activeWorkspace = action.payload;
    },
  },
});

export const {
  workspaceGetSuccess: onWorkspaceGetSuccess,
  workspaceGetByIdSuccess: onWorkspaceGetByIdSuccess,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
