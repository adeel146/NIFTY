import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};

const clearStorage = () => {
  localStorage.clear();
  window.location = "/auth/login";
};
// axios.defaults.withCredentials = true
axios.defaults.baseURL = "";
axios.interceptors.request.use((request) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
  request.headers = headers;
  return request;
});
axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    console.log(error, "error");
    try {
      if (error?.response?.status === 401) {
        if (window.location.pathname !== "/auth/login") {
          clearStorage();
        }
      }
      // Reject the promise for 4xx and 5xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 600) {
        throw error;
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
