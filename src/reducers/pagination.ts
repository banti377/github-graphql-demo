import { Reducer } from "react";

import { paginationConstants } from "../constants";

interface PaginationState {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
}

type ACTIONTYPE =
  | { type: "next"; payload: { after: string } }
  | { type: "prev"; payload: { before: string } }
  | { type: "reset" };

export const initialState: PaginationState = {
  after: null,
  before: null,
  first: paginationConstants.pageSize,
  last: null,
};

const reducer: Reducer<PaginationState, ACTIONTYPE> = (state, action) => {
  const { type } = action;

  switch (type) {
    case "next":
      return {
        after: action.payload.after,
        first: paginationConstants.pageSize,
        last: null,
        before: null,
      };

    case "prev":
      return {
        after: null,
        first: null,
        last: paginationConstants.pageSize,
        before: action.payload.before,
      };

    case "reset":
      return {
        ...initialState,
      };

    default:
      throw new Error(`action type ${type} is nto valid action type.`);
  }
};

export default reducer;
