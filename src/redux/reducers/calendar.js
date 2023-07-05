import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  IsAuthorized: false,
  CurrentDate: null,
};

export const name = "calendar";

const calendarSlice = createSlice({
  initialState,
  name,
  reducers: {
    currentDate: (state, action) => {
      state.CurrentDate = action.payload;
    },
  },
});

export const { currentDate: setCurrentDate} =
  calendarSlice.actions;

export default calendarSlice.reducer;
