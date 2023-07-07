import { useDropzone } from "react-dropzone";
import { AttachFile, DeleteForeverOutlined } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { isEmpty, get } from "lodash";
import { toBase64 } from "./toBase64";
import FileSizeInMb from "./FileSizeInMb";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
const HookSelectFileInput = ({
  allowMulti = false,
  label,
  control,
  name,
  errors,
  disabled = false,
  defaultValue = [],
  ref = null,
}) => {
  console.log("refer", ref);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <SelectFileInput
          label={label}
          disabled={disabled}
          selectedFiles={field.value}
          setValue={field.onChange}
          allowMulti={allowMulti}
          errors={errors}
          name={name}
          ref={ref}
        />
      )}
    />
  );
};

const SelectFileInput = ({
  label,
  selectedFiles,
  setValue,
  allowMulti,
  errors,
  name,
  disabled,
  ref,
}) => {
  const filesToUpload = allowMulti ? selectedFiles.map((obj) => obj) : [];
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length <= 0) {
      return;
    }

    for (const file of acceptedFiles) {
      const fileContent = await toBase64(file);
      const fileExtension = file.name.split(".").pop();
      const fileName = file.name;
      // const fileSize = FileSizeInMb(file.size);
      filesToUpload.push({
        file_content: fileContent,
        file_extension: fileExtension,
        file_name: fileName,
        // file_size: fileSize,
      });
    }
    const result = allowMulti ? filesToUpload : filesToUpload[0];
    setValue(result);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: disabled,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "application/pdf": [],
      "video/*": [],
    },
  });

  const removeAt = (index) => {
    if (allowMulti) {
      const temp = [...selectedFiles];
      temp.splice(index, 1);
      setValue(temp);
      return;
    }
    setValue({});
  };

  return (
    <>
      {label && <p className="text-15 mb-5">{label}</p>}
      <div
        className={` flex justify-center items-center  w-[90px] border-dashed border border-[#00A99B]  bg-[#F2F8FA] cursor-pointer  min-h-[90px] rounded-md ${
          isDragActive && "border-black"
        } `}
        {...getRootProps()}
      >
        <div className="flex justify-center items-center space-x-3">
          <AddIcon sx={{ fontSize: "25px", color: "#B1B5D0" }} />
          {/* <p className="font-medium  text-15 text-[#B1B5D0]">
            File
          </p> */}
        </div>

        {Boolean(get(errors, name)) && (
          <p className="text-11 text-red mt-3">{get(errors, name)?.message}</p>
        )}
        <input {...getInputProps()} ref={ref} />
      </div>
      {!!selectedFiles?.length && allowMulti && (
        <div className="mt-2 mx-[10px]">
          <div className="">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {selectedFiles?.map((sFile, index) => {
                  return (
                    <Grid item xs={4}>
                      <div key={index}>
                        <SingleFile
                          onDelete={() => removeAt(index)}
                          {...sFile}
                        />
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </div>
        </div>
      )}
      {!isEmpty(selectedFiles) && !allowMulti && (
        <div className="mt-5">
          <div className="mt-5">
            <div>
              <SingleFile onDelete={removeAt} {...selectedFiles} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HookSelectFileInput;

const SingleFile = ({
  file_name,
  file_size,
  file_content,
  onDelete,
  file_path,
}) => {
  function getFileExtension(url) {
    if (url) {
      const extension = url?.split(".").pop().toLowerCase();
      return extension || null;
    }
    return null;
  }
  const allowedImageExtendions = ["png", "jpeg", "jpg"];

  return (
    <div className="flex justify-between items-center w-full h-[100px] border my-5 p-5 rounded-4">
      <div className="flex justify-center items-center">
        <div>
          {allowedImageExtendions?.includes(getFileExtension(file_name)) ? (
            file_content ? (
              <img
                src={`data:image/png;base64,${file_content}`}
                width={100}
                height={100}
                alt="logo"
              />
            ) : (
              <img src={file_path} width={40} height={40} alt="logo" />
            )
          ) : getFileExtension(file_name) === "pdf" ? (
            <h6
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "175%",
                letterSpacing: "0.15px",
                color: "#374253",
              }}
              className="text-base font-600"
            >
              {file_name}
            </h6>
          ) : getFileExtension(file_name) === "mp4" ? (
            <h6
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "175%",
                letterSpacing: "0.15px",
                color: "#374253",
              }}
              className="text-base font-600"
            >
              {file_name}
            </h6>
          ) : (
            ""
          )}
        </div>
      </div>
      <div onClick={() => onDelete()} className=" text-28 ms-2">
        <DeleteForeverOutlined
          fontSize="inherit"
          className="cursor-pointer !fill-main-brand"
        />
      </div>
    </div>
  );
};

const FileInputFolderIcon = () => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m.754 8.878 1.34 10.963A1.313 1.313 0 0 0 3.399 21h17.204a1.313 1.313 0 0 0 1.305-1.16l1.338-10.962a.561.561 0 0 0-.558-.628H1.313a.563.563 0 0 0-.56.628ZM21.75 5.813A1.313 1.313 0 0 0 20.437 4.5h-8.96L9.227 3H3.562A1.313 1.313 0 0 0 2.25 4.313V6.75h19.5v-.938Z"
      fill="#A7AFBC"
    />
  </svg>
);
