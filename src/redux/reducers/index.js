import { combineReducers } from "@reduxjs/toolkit";
import portfolioSlice from "./portfolio";
import workspace from "./workspace";
import calendarSlice from "./calendar";
import dashbordSlice from "./mainDashbord";
import projectTaskSlice from "./projectTask";
import profile from "./profile";
import minutesofmeetingSlice from "./minutesofmeetings";

const appReducer = combineReducers({
  portfolioSlice,
  workspace,
  calendarSlice,
  dashbordSlice,
  projectTaskSlice,
  profile,
  minutesofmeetingSlice,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
