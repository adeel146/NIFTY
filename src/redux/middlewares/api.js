import axios from "axios";
import { mapAPIError } from "./mapApiError";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = async ({ data, endPoint, id, method = "POST", params }) => {
  const url = `${BASE_URL}${endPoint}${id ? `/${id}` : ""}${params ?? ""}`;
  const token = `Bearer ${localStorage.getItem("token") ?? ""}`;
  try {
    return await axios({
      data,
      headers: {
        Authorization: token,
      },
      method,
      url,
    });
  } catch (err) {
    throw mapAPIError(err);
  }
};

export const getApi = async (endPoint) => {
  const token = `Bearer ${localStorage.getItem("token") ?? ""}`;
  try {
    return await axios({
      headers: {
        Authorization: token,
      },
      method: "get",
      url: `${BASE_URL}${endPoint}`,
    });
  } catch (err) {
    throw mapAPIError(err);
  }
};
