export interface IInitialState {
  user: string;
  setUser: (user: string) => void;
  repo: string;
  setRepo: (repo: string) => void;
}

interface IUserAction {
  type: "user";
  payload: string;
}

interface IRepoAction {
  type: "repo";
  payload: string;
}

export type Action = IUserAction | IRepoAction;
