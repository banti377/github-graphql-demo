import { FC, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Spin } from "antd";
import debounce from "lodash.debounce";

import { SEARCH_USER } from "../graphql/Query";
import RepositoryList from "../components/RepositoryList";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import { StateContext } from "../context/State";
import paginationReducer, {
  initialState,
} from "../reducers/pagination";
import { DEBOUNCE_INTERVAL } from "../constants";

const Home: FC = () => {
  const { user, setUser, reset } = useContext(StateContext);

  const [userPagination, userPaginationDispatch] = useReducer(
    paginationReducer,
    initialState
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermInput, setSearchTermInput] = useState("");

  const updateSearchTerm = useMemo(
    () =>
      debounce((query: string) => {
        reset();
        // userPaginationDispatch({ type: "reset" });
        if (query && query.trim()) {
          setSearchTerm(query);
        }
      }, DEBOUNCE_INTERVAL),
    [setSearchTerm, reset],
  );

  const [
    searchUser, {
      data: userData,
      loading: userLoading,
      error: userError
    }
  ] = useLazyQuery(
    SEARCH_USER,
    {
      variables: {
        query: searchTerm,
        type: "USER",
        first: userPagination.first,
        last: userPagination.last,
        after: userPagination.after,
        before: userPagination.before,
      },
    }
  );

  const onPrev = () => {
    userPaginationDispatch({
      type: "prev",
      payload: {
        before: userData.search.pageInfo.startCursor,
      },
    });
  };

  const onNext = () => {
    userPaginationDispatch({
      type: "next",
      payload: {
        after: userData.search.pageInfo.endCursor,
      },
    });
  };

  useEffect(() => {
    if (searchTerm) {
      searchUser();
    }
  }, [searchTerm, searchUser]);

  // User view. instead of ternary, this is easier to read.
  let userView = (
    <div className="flex items-start justify-center mt-5">
      <p className="text-black text-lg font-medium">Please search and select a user.</p>
    </div>
  );
  if (userLoading) {
    userView = (
      <div className="flex items-center justify-center h-40">
        <Spin tip="Getting users..." />
      </div>
    );
  } else if (userData) {
    userView = (
      <div className="my-5">
        <UserList
          setUser={setUser}
          userData={userData || []}
          onPrev={onPrev}
          onNext={onNext}
          selectedUser={user}
        />
      </div>
    );
  } else if (userError) {
    userView = (
      <div className="flex items-start justify-center">
        <p className="text-red-600">{userError.message || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto h-screen p-10">
      <div className="flex items-center justify-center">
        <SearchBar
          className="w-1/2"
          searchTerm={searchTermInput}
          setSearchTerm={(search) => {
            setSearchTermInput(search);
            // When search changes move user to page 1.
            userPaginationDispatch({ type: "reset" });
            updateSearchTerm(search);
          }}
        />
      </div>
      {userView}
      {user && <RepositoryList />}
    </div>
  );
};

export default Home;
