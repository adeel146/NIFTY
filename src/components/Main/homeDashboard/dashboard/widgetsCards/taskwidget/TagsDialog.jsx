import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { Divider, Grid } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { tagsClose } from "redux/actions";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TagsDialog({ tagsAssignList }) {
  const classes = useStyles();
  const isOpen = useSelector((state) => state?.projectTaskSlice?.tagsState);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(tagsClose());
  };

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="lg"
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            All Tags
            <div onClick={handleClose} className="cursor-pointer">
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <Grid container spacing={2}>
            {tagsAssignList?.map((val, index) => {
              return (
                <Grid item xs={3} key={index}>
                  <div
                    className="rounded-md h-auto text-white flex items-center justify-center"
                    style={{ background: val?.color }}
                  >
                    {val.name}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflowY: "unset !important",
    width: "600px",
  },
}));
