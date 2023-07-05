import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { onWorkspaceGetByIdSuccess } from "redux/actions";
import { useDisplayError } from "hooks/useDisplayError";
import { enqueueSnackbar } from "notistack";

const BASE_URL = import.meta.env.VITE_API_URL;

const ActionType = {
  INITIALIZE: "INITIALIZE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  // const display = useDisplayError();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const setBaseUrl = () => {
      axios.defaults.baseURL = BASE_URL;
    
    };
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const response = await axios.get("/auth/current", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const user = response.data?.data?.user;
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user: user,
            },
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    setBaseUrl();
    initialize();
  }, []);

  const login = async (body) => {
    const response = await axios.post("/auth/login", body);
    console.log("response", response)
    if(response?.data?.data) {
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      dispatch({
        type: ActionType.LOGIN,
        payload: {
          user,
        },
      });
    } else {
      enqueueSnackbar(response.message)
    }
    
  };

  const register = async (registerBody) => {
    const response = await axios.post("/user/basic_info", registerBody);
    const token = response.data?.data?.token;
    const user = response.data?.data?.user;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    dispatch({
      type: ActionType.LOGIN,
      payload: {
        user,
      },
    });
  };

  const resetPassword = async () => {
    // const response = await axios.post("/auth/ResetPassword", resetBody);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("workspaceId");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: ActionType.LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
