import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const CreateDocument = ({
  open,
  handleCloseDialog,
  documentContent,
  setDocumentContent,
  handleSaveDocument,
}) => {
  return (
    <Dialog
      keepMounted
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={handleCloseDialog}
    >
      <DialogTitle>Create Document</DialogTitle>
      <DialogContent dividers style={{ height: "100vh" }}>
        <ReactQuill
          value={documentContent}
          onChange={setDocumentContent}
          placeholder="Start typing here..."
          theme="snow"
          style={{ height: "100%" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          onClick={handleSaveDocument}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDocument;
