export interface IInitialState {
  user: string;
  setUser: (user: string) => void;
  repo: string;
  setRepo: (repo: string) => void;
  repoId: string;
  setRepoId: (repoId: string) => void;
  reset: () => void;
}

export interface IUser {
  node: {
    login: string;
    avatarUrl: string;
    name: string;
  };
}

export interface IUserData {
  search: {
    edges: [node: IUser];
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
  };
}

export interface IIssueITem {
  title: string;
  createdAt: Date;
  author: {
    login: string;
  };
}

export interface IRepoItem {
  name: string;
  id: string;
  stargazerCount: number;
  watchers: {
    totalCount: number;
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

interface IResetAction {
  type: "reset";
}

export type Action = IUserAction | IRepoAction | IRepoIdAction | IResetAction;
