import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileState: false,
};

const profileSlice = createSlice({
  name: "profile_slice",
  initialState: initialState,
  reducers: {
    openProfile(state) {
      state.profileState = true;
    },
    closeProfile(state) {
      state.profileState = false;
    },
  },
});

export const { openProfile, closeProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
