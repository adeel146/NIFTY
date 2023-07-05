import React, { useState } from "react";
import Button from "@mui/material/Button";
import { openPortfolio } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import AddPortfolioDialog from "./portfolio/AddPortfolioDialog";
import { useGetWorkspaceById } from "hooks/Workspace";
import { onWorkspaceGetByIdSuccess } from "redux/actions";

const index = () => {
  const dispatch = useDispatch();
  const [workspaceId, setWorkspaceId] = useState(
    localStorage.getItem("workspaceId")
  );
  const onSuccess = (data) => {
    if (data.data) {
      dispatch(onWorkspaceGetByIdSuccess(data.data.data));
    }
  };

  const workspaceResponse = useGetWorkspaceById({
    id: workspaceId,
    onSuccess,
    enabled: !!workspaceId,
  });
  return (
    <div>
      {/* <Button variant="contained" onClick={() => dispatch(openPortfolio())}>
        add portfolio
      </Button>
      <AddPortfolioDialog /> */}
    </div>
  );
};

export default index;
