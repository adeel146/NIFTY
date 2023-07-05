import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid } from "@mui/material";
import HookTextField from "hooks/Common/HookTextField";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import React from "react";
import { useForm } from "react-hook-form";
import { fileSchema } from "validations/portfolio";
import { closeFileDialog } from "redux/reducers/portfolio";
import Slide from "@mui/material/Slide";
import { useCreateFolder } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const ShareDialog = (id) => {
    const display = useDisplaySuccess();
    const {
        control,
        setValue,
        formState: {errors},
        handleSubmit,
    } = useForm({
        resolve: yupResolver(fileSchema),
        mode: "onChange",
    })

    const dispatch = useDispatch();
    const projectId =localStorage?.getItem("projectId");
    const open = useSelector((state) =>  state?.portfolioSlice?.fileState)

    const onSuccess = (data) => {
        display(data?.message)
        dispatch(closeFileDialog())
        setValue('name',"")
    }

    const Folders = useCreateFolder({ onSuccess });
    const error = Folders.error;
    useDisplayError(error);

    console?.log("id", id)
    const onSubmit = (data) => {
      const body = {
        name: data?.name,
        description: "",
        parent_Id: id?.id,
        project_Id: projectId,
      }

      Folders?.mutate({data: body});
    }

    return (
        <Dialog 
        open={open}
        onClose={() => dispatch(closeFileDialog())}
        TransitionComponent={Transition}>
            <DialogTitle>
                CREATE FOLDER
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <Grid container>
                     <Grid item xs={12}>
                        <HookTextField
                        control={control}
                        name="name"
                        fullWidth
                        errors={errors}
                        placeholder="Folder name..."
                        />
                     </Grid>
                </Grid>
            </DialogContent>
            <Divider/>
            <DialogActions>
                <WhiteButton 
                buttonText="Cancel"
                onClick={() => dispatch(closeFileDialog())}
                />
                <GreenButton 
                buttonText="Create"
                onClick={handleSubmit(onSubmit)}
                />
            </DialogActions>
        </Dialog>
    )
}

export default ShareDialog;