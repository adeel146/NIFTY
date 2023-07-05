import React, { Fragment, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  openMatrixDialog,
  setSelectedRiskAssesment,
  taskAssessmentOpen,
} from "redux/actions";
import { useDispatch } from "react-redux";
import MatrixColorDialog from "./MatrixColorDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import EnhancedTable from "hooks/Common/EnhancedTable";
const RiskAssessmentView = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const workSpaceId = localStorage.getItem("workspaceId");
  const [base64Files, setBase64Files] = useState([]);

  const { data: riskDataAssessment, isLoading } = useQuery(
    ["get_risk_assesment", projectId],
    () => {
      return axios.get(`/riskmanagement/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );
  const { data: workspaceUserId } = useQuery(
    ["dropdown_dependency", workSpaceId],
    () => {
      return axios.get(`/workspace/workspace_members/${workSpaceId}`);
    },
    {
      enabled: !!workSpaceId,
      select: (res) => {
        return res.data.data.map((val) => {
          return {
            label: val?.name,
            value: val?.user_Id,
          };
        });
      },
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Risk Description",
        accessor: "riskDescription",
      },
      {
        Header: "Impact Description",
        accessor: "impactDescription",
      },
      {
        Header: "Impact Level",
        accessor: "impactLevel",
      },
      {
        Header: "Probability Level",
        accessor: "probabilityLevel",
      },
      {
        Header: "Priority Level",
        accessor: "severityLevel",
      },
      {
        Header: "Migration Notes",
        accessor: "migrationNotes",
      },
      {
        Header: "Owner",
        accessor: "owner",
        Cell: (params) => {
          return <div>{params.row.original.owner.name}</div>;
        },
      },
    ],
    [riskDataAssessment]
  );

  const handleFileUpload = (event) => {
    const files = event.target.files;

    // Create an array to store the base64 strings
    const base64Array = [];

    // Loop through each file and read it as base64
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove the "data:image/jpeg;base64," part
        base64Array.push({
          file_content: base64String,
          name: file.name,
          extension: file.name.split(".").pop(),
        });
        setBase64Files((prevFiles) => [...prevFiles, base64String]); // Update the base64Files state with the new file

        // Check if all files have been processed
        if (base64Array.length === files.length) {
          // Call a function to handle the base64 data
          handleBase64Upload(base64Array);
        }
      };
      reader.readAsDataURL(file); // Read the file as base64
    });
  };

  const handleBase64Upload = (base64Array) => {
    // You can perform any desired operations with the base64 data here
    // console.log("Previously uploaded files:", base64Files);
    // console.log("Newly selected files:", base64Array);
  };

  const handleDeleteFile = (index) => {
    setBase64Files((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1); // Remove the file at the specified index
      return updatedFiles;
    });
  };
  const handleRowClick = (e, row) => {
    dispatch(setSelectedRiskAssesment(row.original));
    dispatch(taskAssessmentOpen());
  };

  return (
    <Fragment>
      <div className="px-6 flex space-x-2">
        <div className="w-full">
          <div className="mt-[2rem] mx-[1px]">
            <EnhancedTable
              columns={columns}
              data={riskDataAssessment ?? []}
              isLoading={isLoading}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
        {/* <div className="mt-6 cursor-pointer text-[#00A99B]  ">
          <AddIcon
            sx={{ fontSize: "30px" }}
            onClick={() => dispatch(taskAssessmentOpen())}
          />
        </div> */}
      </div>

      <MatrixColorDialog />

      {/* <div>
        <input type="file" multiple onChange={handleFileUpload} />
        {base64Files.map((base64, index) => (
          <div key={index}>
            <p>File {index + 1}</p>
            <img
              src={`data:image/jpeg;base64,${base64}`}
              alt={`File ${index + 1}`}
            />
            <button onClick={() => handleDeleteFile(index)}>Delete</button>
          </div>
        ))}
      </div> */}
    </Fragment>
  );
};

export default RiskAssessmentView;
