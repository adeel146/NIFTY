import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectTaskState: false,
  subTask: false,
  childSubTask: false,
  taskState: false,
  milestoneDialogState: false,
  tagsState: false,
  taskId: null,
  subtaskDetailShow: false,
  personalTaskDrwayerState: false,
  changeRequestDialogState: false,
  sidebarWidth: "300px",
  settingSide: "300px",
  portfolioIdcheck: null,
  taskAssessmentState: false,
  matrixState: false,
  riskState: false,
  selectedRiskId: null,
  selectedRiskAssesment: null,
  headerState: false,
  currentTabName: null,
  listType: "add",
  headerMenuName: "Dashboard",
  persisDateValue: null,
  newRequestType: null,
  milestoneProgress: false,
  moduleInformation: null,
  duplicateProjectDialogState: false,
};

const projectTaskSlice = createSlice({
  name: "projectTask_slice",
  initialState: initialState,

  reducers: {
    openProjectTask(state) {
      state.projectTaskState = true;
    },
    closeProjectTask(state) {
      state.projectTaskState = false;
    },

    subTaskShow(state) {
      state.subTask = true;
    },
    subTaskHide(state) {
      state.subTask = false;
    },
    subChildTaskShow(state) {
      state.childSubTask = true;
    },
    subChileTaskHide(state) {
      state.childSubTask = false;
    },
    taskDrawyerOpen(state, action) {
      state.taskState = true;
      state.taskId = action.payload;
    },
    taskDrawyerClose(state) {
      state.taskState = false;
      state.taskId = null;
    },
    openMilestoneCardDilalog(state) {
      state.milestoneDialogState = true;
    },
    closeMilestoneCardDilalog(state) {
      state.milestoneDialogState = false;
    },
    tagsOpen(state) {
      state.tagsState = true;
    },
    tagsClose(state) {
      state.tagsState = false;
    },
    subtaskSideShow(state) {
      state.subtaskDetailShow = true;
    },
    subtaskSideHide(state) {
      state.subtaskDetailShow = false;
    },
    personalTaskDrawyerOpen(state) {
      state.personalTaskDrwayerState = true;
    },
    changeRequestDialogOpen(state) {
      state.changeRequestDialogState = true;
    },
    changeRequestDialogClose(state) {
      state.changeRequestDialogState = false;
    },
    duplicateProjectDialogOpen(state) {
      state.duplicateProjectDialogState = true;
    },
    duplicateProjectDialogClose(state) {
      state.duplicateProjectDialogState = false;
    },
    personalTaskDrawyerClose(state) {
      state.personalTaskDrwayerState = false;
    },
    openSidebarWidth(state) {
      state.sidebarWidth = "300px";
    },
    closeSidebarWidth(state) {
      state.sidebarWidth = "60px";
    },
    settingSidebarOpen(state) {
      state.settingSide = "300px";
    },
    settingSidebarClose(state) {
      state.settingSide = "60px";
    },
    portfolioIdSet(state, action) {
      state.portfolioIdcheck = action.payload;
    },

    taskAssessmentOpen(state) {
      state.taskAssessmentState = true;
    },
    taskAssessmentClose(state) {
      state.taskAssessmentState = false;
    },
    openMatrixDialog(state) {
      state.matrixState = true;
    },
    closeMatrixDialog(state) {
      state.matrixState = false;
    },
    setSelectedRiskId(state, action) {
      state.selectedRiskId = action.payload;
    },
    removeSelectedRiskId(state) {
      state.selectedRiskId = null;
    },
    openRiskColor(state) {
      state.riskState = true;
    },
    closeRiskColor(state) {
      state.riskState = false;
    },
    setSelectedRiskAssesment(state, action) {
      state.selectedRiskAssesment = action.payload;
    },
    removeSelectedRiskAssesment(state) {
      state.selectedRiskAssesment = null;
    },
    openHeaderDrawyer(state) {
      state.headerState = true;
    },
    closeHeaderDrawyer(state) {
      state.headerState = false;
    },
    listTypeRequest(state, action) {
      state.listType = action.payload;
    },
    setHeaderMenuName(state, action) {
      state.headerMenuName = action.payload;
    },
    setDateValuePersis(state, action) {
      state.persisDateValue = action.payload;
    },
    setNewRequestType(state, action) {
      state.newRequestType = action.payload;
    },
    openMilestoneProgress(state) {
      state.milestoneProgress = true;
    },
    closeMilestoneProgress(state) {
      state.milestoneProgress = false;
    },
    setModuleInformation(state, action) {
      state.moduleInformation = action.payload;
    },
  },
});

export const {
  openProjectTask,
  closeProjectTask,
  subTaskShow,
  subTaskHide,
  subChileTaskHide,
  subChildTaskShow,
  taskDrawyerOpen,
  taskDrawyerClose,
  openMilestoneCardDilalog,
  closeMilestoneCardDilalog,
  tagsOpen,
  tagsClose,
  subtaskSideShow,
  subtaskSideHide,
  personalTaskDrawyerOpen,
  personalTaskDrawyerClose,
  openSidebarWidth,
  closeSidebarWidth,
  settingSidebarOpen,
  settingSidebarClose,
  portfolioIdSet,
  taskAssessmentOpen,
  taskAssessmentClose,
  closeMatrixDialog,
  openMatrixDialog,
  openRiskColor,
  closeRiskColor,
  setSelectedRiskId,
  removeSelectedRiskId,
  setSelectedRiskAssesment,
  removeSelectedRiskAssesment,
  openHeaderDrawyer,
  closeHeaderDrawyer,
  listTypeRequest,
  setHeaderMenuName,
  setDateValuePersis,
  setNewRequestType,
  closeMilestoneProgress,
  openMilestoneProgress,
  setModuleInformation,
  changeRequestDialogOpen,
  changeRequestDialogClose,
  duplicateProjectDialogOpen,
  duplicateProjectDialogClose,
} = projectTaskSlice.actions;

export default projectTaskSlice.reducer;
