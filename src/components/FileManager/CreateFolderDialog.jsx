import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
} from "@mui/material";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CreateFolderDialog = (id) => {
  const display = useDisplaySuccess();
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolve: yupResolver(fileSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const projectId = localStorage?.getItem("projectId");
  const open = useSelector((state) => state?.portfolioSlice?.fileState);

  // const onSuccess = (data) => {
  //   display(data?.message);
  //   dispatch(closeFileDialog());
  //   setValue("name", "");
  // };
  const queryClient = useQueryClient();
  const { mutate: Folders, isLoading: creatingFolder } = useMutation(
    {
      mutationFn: (data) => axios.post(`/folder`, data),
      onSuccess: (data) => {
        if (data?.data?.success) {
          enqueueSnackbar(data?.data?.message, { variant: "success" });
          queryClient.invalidateQueries(["file"]);
          dispatch(closeFileDialog());
          setValue("name", "");
        }
      },
      onError: (data) => {
        enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      },
    }
  );

  // const Folders = useCreateFolder({ isLoading: creatingFolder, onSuccess });
  // const error = Folders.error;
  // useDisplayError(error);

  const onSubmit = (data) => {
    const body = {
      name: data?.name,
      description: "",
      parent_Id: id?.id,
      project_Id: projectId,
    };

    Folders(body);
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeFileDialog())}
      TransitionComponent={Transition}>
      <DialogTitle className="bg-[#fafbfd] w-full cursor-pointer">
        <h6 className="font-Manrope font-extrabold text-black text-xl">
          CREATE FOLDER
        </h6>
      </DialogTitle>
      <Divider />
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
      <Divider />
      <DialogActions className="border-t bg-[#fafbfd] cursor-pointer">
        <WhiteButton
          buttonText="Cancel"
          onClick={() => dispatch(closeFileDialog())}
        />
        <GreenButton 
          loading={creatingFolder}
          buttonText="Create" 
          onClick={handleSubmit(onSubmit)} 
        />
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
