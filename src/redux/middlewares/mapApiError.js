import axios from "axios";

export const mapAPIError = (error) => {
  const custom = null;
  if (!axios.isAxiosError(error)) return custom;

  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("workspaceId");
      window.location.reload();
    }
    // server throw status > 200
    const err = error.response.data;
    return err.message || custom;
  } else if (error.request) {
    // The request was made but no response was received
    return error.message || custom;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message;
  }
};
