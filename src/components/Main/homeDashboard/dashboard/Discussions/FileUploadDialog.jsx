import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { toBase64 } from "hooks/Common/toBase64";
import DeleteIcon from "@mui/icons-material/Delete";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UploadFileDialog = ({
  open,
  handleClose,
  message,
  setMessage,
  uploadedFiles,
  setUploadedFiles,
  handleSubmit,
  submitDiscussion,
}) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(
    Array(uploadedFiles.length).fill(false)
  );

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFilesArray = await Promise.all(
      Array.from(files).map(async (file) => {
        const fileContent = await toBase64(file);
        return {
          file_name: file.name,
          file_extension: file.name.split(".").pop(),
          file_content: fileContent,
        };
      })
    );

    setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFilesArray]);
  };

  const handleMouseEnter = (index) => {
    setShowDeleteIcon((prev) => {
      const updatedShowDeleteIcon = [...prev];
      updatedShowDeleteIcon[index] = true;
      return updatedShowDeleteIcon;
    });
  };

  const handleMouseLeave = (index) => {
    setShowDeleteIcon((prev) => {
      const updatedShowDeleteIcon = [...prev];
      updatedShowDeleteIcon[index] = false;
      return updatedShowDeleteIcon;
    });
  };

  const handleDeleteFile = (index) => {
    setUploadedFiles((prev) => {
      const updatedSelectedFiles = [...prev];
      updatedSelectedFiles.splice(index, 1);
      return updatedSelectedFiles;
    });
  };

  const renderFileElement = (file) => {
    const extension = file.file_extension.toLowerCase();
    if (extension === "jpg" || extension === "png" || extension === "gif") {
      return (
        <img
          src={`data:image/${extension};base64,${file?.file_content}`}
          alt=""
        />
      );
    } else if (extension === "pdf") {
      return <img className="logo-icon  " src="/images/pdf.png" alt="logo" />;
    } else {
      return <img className="logo-icon  " src="/images/doc.png" alt="logo" />;
    }
  };
  return (
    <Dialog
      keepMounted
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
    >
      <div className="bg-[#fafbfd] items-center border-b border-b-[#ececec] flex h-16 justify-between pr-5 font-Manrope font-bold text-2xl modal_header ">
        <DialogTitle>Upload a file</DialogTitle>
        <CloseIcon
          sx={{
            width: "40px",
            height: "40px",
            fill: "gray",
            fontSize: "24px",
            padding: "5px 5px",
          }}
          onClick={handleClose}
          className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer shadow-lg"
        />
      </div>

      <DialogContent className="mt-3">
        <label className="block mb-5 ">
          <span className={"font-semibold text-[15px] font-Manrope mb-3"}>
            Message
          </span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message about this file"
            className="w-[95%] border mt-2 bg-white border-[#e8e8e9] py-2 rounded-md shadow-inner px-3 placeholder:text-sm placeholder:font-normal placeholder:font-Manrope tracking-wide"
          />
        </label>

        <h4 className={"block font-semibold  text-[15px] mb-1 font-Manrope"}>
          Files
        </h4>
        <div className="flex ">
          {uploadedFiles.length > 0 && (
            <div>
              <div className="flex items-center gap-5">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "147px",
                      height: "160px",
                      position: "relative",
                      background: "ghostwhite",
                      border: "1px solid #fafbfd",
                      boxShadow: "0 2px 4px 0 rgba(0,0,0,.08)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    {showDeleteIcon[index] && (
                      <div
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          cursor: "pointer",
                          background: "#191919",
                          borderRadius: "4px",
                          opacity: ".90",
                          display: index === 0 ? "none" : "block",
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <DeleteIcon
                          style={{ color: "white", fontSize: "20px" }}
                        />
                      </div>
                    )}
                    {/* <img
                    src={`data:image/${file.extention};base64,  ${file?.file_content}`}
                    alt=""
                  /> */}
                    {renderFileElement(file)}
                    <div className="text-[13px] text-center">
                      {file.file_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              multiple
              onChange={handleFileUpload}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="plus_btn">
              <Button component="span" variant="contained">
                +
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
      <DialogActions
        className="bg-[#fafbfd] border-t border-t-[#ececec] h-[80px]"
        sx={{ padding: "32px" }}
      >
        <WhiteButton buttonText="Cancel" onClick={handleClose} />
        <GreenButton
          loading={submitDiscussion.isLoading}
          buttonText="Upload"
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog;
