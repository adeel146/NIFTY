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
import { closeDeleteDialog } from "redux/reducers/portfolio";
import Slide from "@mui/material/Slide";
import { useCreateFolder, useDeleteFile, useDeleteFolder, useGetFolder } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const DeleteFileDialog = ({id, type, parentId}) => {
    const display = useDisplaySuccess();
    const {
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({
        resolve: yupResolver(fileSchema),
        mode: "onChange",
    })


    const dispatch = useDispatch();
    const projectId =localStorage?.getItem("projectId");
    // const rootFolderId =localStorage?.getItem("rootFolderId");
    const rootFolderId = useSelector((state) => state?.portfolioSlice?.parentIdState);
    const open = useSelector((state) =>  state?.portfolioSlice?.deleteFileState)

    const onSuccess = (data) => {
        display(data?.message)
        // const Files = useGetFolder({ id: parentId, onSuccess })

        dispatch(closeDeleteDialog())
    }

    const File = (data) => {
        display(data?.message)
        // const Files = useGetFolder({ id: parentId, onSuccess })
        dispatch(closeDeleteDialog())
    }

    const deleteFolders = useDeleteFolder({ id: id,parentId:parentId, onSuccess });
    const deleteFile = useDeleteFile({id: id, parentId:parentId,onSuccess: File})

    const onSubmit = (data) => {
      if(type == "Folder") {
        deleteFolders?.mutate({data: {}});
        
      } else {
        deleteFile?.mutate({data: {}})
        
      }
    }

    return (
        <Dialog 
        open={open}
        onClose={() => dispatch(closeDeleteDialog())}
        TransitionComponent={Transition}
        >
            <DialogTitle>
                Delete {type}
            </DialogTitle>
            <Divider/>
            <DialogContent>
               <p>Do you really want to delete this {type}</p> 
            </DialogContent>
            <Divider/>
            <DialogActions>
                <WhiteButton 
                buttonText="Cancel"
                onClick={() => dispatch(closeDeleteDialog())}
                />
                <GreenButton 
                buttonText="Delete"
                onClick={handleSubmit(onSubmit)}
                />
            </DialogActions>
        </Dialog>
    )
}

export default DeleteFileDialog;