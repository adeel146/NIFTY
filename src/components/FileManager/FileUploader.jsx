// import "react-dropzone-uploader/dist/styles.css";
// import "src/app/main/file-directory/file.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddFile } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import HookSelectFileInput from "hooks/Common/HookFileSelect";
import { uploadFileSchema } from "validations/portfolio";

const FileUploader = ({id, ref}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(uploadFileSchema),
    mode: "onChange",
  });

  console.log("reference", ref)
  const display = useDisplaySuccess();
  const onSuccess = (data) => {
    display(data?.message)
  }

  const addFile = useAddFile({onSuccess});

  const submitForm = (formValues) => {
    const body = {
      folder_Id: id?.id,
      attachment: formValues?.attachment,
    };
    addFile?.mutate({data: body});
  };
  return (
    <form
      id="fileDirectory_form"
      noValidate
      onSubmit={handleSubmit(submitForm)}
      // className="px-[2rem] py-[2rem]"
    >
      <HookSelectFileInput
        control={control}
        error={errors}
        name="attachment"
        ref={ref}
        fullWidth
      />
    
        {/* <div className="flex justify-end align-center py-[2rem]">
        <CommonButton type="submit" id="fileDirectory_form" disabled={disable && !disable.file_name}>
          {t("UPLOAD")}
        </CommonButton>
      </div> */}
      
    </form>
  );
};

export default FileUploader;
