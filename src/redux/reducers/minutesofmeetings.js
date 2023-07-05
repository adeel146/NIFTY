import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  selectedmeeting: null,
};

export const name = "minutesofmeetings";

const minutesofmeetingSlice = createSlice({
  initialState,
  name,
  reducers: {
    resetMeetingState: () => initialState,
    setCurrentMeeting: (state, action) => {
      state.selectedmeeting = action.payload;
    },
    changeMeetingName: (state, action) => {
      state.selectedmeeting.name = action.payload;
    },
    changeMeetingDate: (state, action) => {
      state.selectedmeeting.when = action.payload;
    },
    addUsers: (state, action) => {
      state.selectedmeeting.users = state.selectedmeeting.users.concat(
        action.payload
      );
    },
    removeUsers: (state, action) => {
      state.selectedmeeting.users.splice(action.payload, 1);
    },
    setNotes: (state, action) => {
      state.selectedmeeting.notes = action.payload;
    },
    assignUserTalkingPoint: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.talkingPoints[index].user_Id = data;
      }
    },
    addNewTalkingPoint: (state, action) => {
      if (action.payload)
        state.selectedmeeting.talkingPoints.push(action.payload);
    },
    removeTalkingPoint: (state, action) => {
      const index = action.payload;
      state.selectedmeeting.talkingPoints.splice(index, 1);
    },
    talkingPointInputChange: (state, action) => {
      const { data, index } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.talkingPoints[index].name = data;
      }
    },
    talkingPointCompleted: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.talkingPoints[index].completed = data;
      }
    },
    addNewactionItems: (state, action) => {
      if (action.payload)
        state.selectedmeeting.actionItems.push(action.payload);
    },
    removeactionItems: (state, action) => {
      const index = action.payload;
      state.selectedmeeting.actionItems.splice(index, 1);
    },
    convertActionItemtoTask: (state, action) => {
      const index = action.payload;
      state.selectedmeeting.actionItems[index].isTask =
        !state.selectedmeeting.actionItems[index].isTask;
    },
    actionItemsInputChange: (state, action) => {
      const { data, index } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.actionItems[index].name = data;
      }
    },
    actionItemsCompleted: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.actionItems[index].completed = data;
      }
    },
    actionItemsDateChange: (state, action) => {
      const {
        index,
        startDate = new Date().toISOString(),
        endDate = new Date().toISOString(),
      } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.actionItems[index].startDate = startDate;
        state.selectedmeeting.actionItems[index].endDate = endDate;
      }
    },
    assignUserActionItem: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.actionItems[index].userIds.push(data);
      }
    },
    assignMileStoneActionItem: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0) {
        state.selectedmeeting.actionItems[index].milestoneId = data;
      }
    },
  },
});

export const {
  removeUsers,
  actionItemsDateChange,
  changeMeetingDate,
  setCurrentMeeting,
  addNewTalkingPoint,
  removeTalkingPoint,
  talkingPointInputChange,
  talkingPointCompleted,
  setNotes,
  changeMeetingName,
  resetMeetingState,
  addNewactionItems,
  removeactionItems,
  actionItemsInputChange,
  actionItemsCompleted,
  assignUserTalkingPoint,
  assignUserActionItem,
  convertActionItemtoTask,
  addUsers,
  assignMileStoneActionItem,
} = minutesofmeetingSlice.actions;

export default minutesofmeetingSlice.reducer;
