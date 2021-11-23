import { createContext, FC, useReducer } from "react";

import { Action, IInitialState } from "../interfaces";

const initialState = {
  user: "",
  setUser: (user: string) => {},
  repo: "",
  setRepo: (repo: string) => {},
  repoId: "",
  setRepoId: (repoId: string) => {},
  reset: () => {},
};

export const StateContext = createContext(initialState);

const authReducer = (state: IInitialState, action: Action): IInitialState => {
  switch (action.type) {
    case "user":
      return { ...state, user: action.payload };
    case "repo":
      return { ...state, repo: action.payload };
    case "repoId":
      return { ...state, repoId: action.payload };
    case "reset":
      return { ...state, user: "", repo: "", repoId: "" };
    default:
      return state;
  }
};

export const StateProvider: FC = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setUser = (user: string) => dispatch({ type: "user", payload: user });

  const setRepo = (repo: string) => dispatch({ type: "repo", payload: repo });

  const setRepoId = (repoId: string) =>
    dispatch({ type: "repoId", payload: repoId });

  const reset = () => dispatch({ type: "reset" });

  return (
    <StateContext.Provider
      value={{
        user: state.user,
        repo: state.repo,
        repoId: state.repoId,
        setUser,
        setRepo,
        setRepoId,
        reset,
      }}
      {...props}
    />
  );
};
