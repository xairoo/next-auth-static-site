import React from "react";
import {
  InitialStateProps,
  ReducerActionProps,
  SessionProviderProps,
} from "./types";

const initialState = {
  status: undefined,
  token: undefined,
  data: {},
};

export const AuthStateContext = React.createContext<{
  state: InitialStateProps;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function useAuthContext() {
  return React.useContext(AuthStateContext);
}

function reducer(state: InitialStateProps, action: ReducerActionProps) {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        token: action.payload?.token,
        data: action.payload?.data,
      };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "LOGOUT":
      return initialState;
    case "RESET_AUTH":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function SessionProvider(props: SessionProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState, () => {
    const localState = { ...initialState };
    if (typeof window !== "undefined") {
      try {
        localState.token = localStorage.getItem("auth_token")
          ? JSON.parse(localStorage.getItem("auth_token") || "")
          : null;
      } catch (err) {}
      try {
        if (localState.token) {
          localState.data = localStorage.getItem("auth_data")
            ? JSON.parse(localStorage.getItem("auth_data") || "")
            : null;
        }
      } catch (err) {}
    }
    return localState;
  });

  React.useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token")
        ? JSON.parse(localStorage.getItem("auth_token") || "")
        : null;

      const data =
        token && localStorage.getItem("auth_data")
          ? JSON.parse(localStorage.getItem("auth_data") || "")
          : null;

      if (token) {
        dispatch({
          type: "SET_SESSION",
          payload: { token, data },
        });
      } else {
        dispatch({
          type: "LOGOUT",
        });
      }
    } catch (err) {}
  }, []);

  return (
    <AuthStateContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthStateContext.Provider>
  );
}
