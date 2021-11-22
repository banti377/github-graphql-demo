export interface IInitialState {
  user: string;
  setUser: (user: string) => void;
  repo: string;
  setRepo: (repo: string) => void;
  repoId: string;
  setRepoId: (repoId: string) => void;
}

export interface IITem {
  title: string;
  createdAt: Date;
  author: {
    login: string;
  };
}

interface IUserAction {
  type: "user";
  payload: string;
}

interface IRepoAction {
  type: "repo";
  payload: string;
}

interface IRepoIdAction {
  type: "repoId";
  payload: string;
}

export type Action = IUserAction | IRepoAction | IRepoIdAction;
