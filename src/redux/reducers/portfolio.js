import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portfolioState: false,
  fileState: false,
  deleteFileState: false,
  showConfigure: null,
  fileIdState: null,
  folderIdState: null,
  parentIdState: null,
};

const portfolioSlice = createSlice({
  name: "portfolio_slice",
  initialState: initialState,
  reducers: {
    openPortfolio(state) {
      state.portfolioState = true;
    },
    closePortfolio(state) {
      state.portfolioState = false;
    },
    showConfigure(state, action) {
      state.showConfigure = action.payload;
    },
    openFileDialog(state) {
      state.fileState = true;
    },
    closeFileDialog(state) {
      state.fileState = false;
    },
    openDeleteDialog(state) {
      state.deleteFileState = true;
    },
    closeDeleteDialog(state) {
      state.deleteFileState = false;
    },

    setActiveFolderId(state, action) {
      state.folderIdState = action.payload;
    },
    setActiveFileId(state, action) {
      state.fileIdState = action.payload;
    },
    setParentFolderId(state, action) {
      state.parentIdState = action.payload;
    },
  },
});

export const {
  openPortfolio,
  closePortfolio,
  showConfigure,
  openFileDialog,
  closeFileDialog,
  openDeleteDialog,
  closeDeleteDialog,
  setActiveFileId,
  setActiveFolderId,
  setParentFolderId,
} = portfolioSlice.actions;
export default portfolioSlice.reducer;
