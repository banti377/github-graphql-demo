import { useLazyQuery } from "@apollo/client";
import { FC, useContext, useEffect, useReducer, useState } from "react";
import { Spin } from "antd";

import { SEARCH_USER } from "../graphql/Query";
import RepositoryList from "../components/RepositoryList";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import { StateContext } from "../context/State";
import paginationReducer, {
  initialState,
} from "../reducers/pagination.reducer";

const Home: FC = () => {
  const { user, setUser, reset } = useContext(StateContext);

  const [userPagination, userPaginationDispatch] = useReducer(
    paginationReducer,
    initialState
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [searchUser, { data: userData, loading: userLoading }] = useLazyQuery(
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
    if (!searchTerm) {
      reset();
    }
  }, [searchTerm, reset]);

  useEffect(() => {
    if (searchTerm) {
      searchUser();
    }
  }, [searchTerm, searchUser]);

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-100 h-screen">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(search) => {
          // When search changes move user to page 1.
          userPaginationDispatch({ type: "reset" });
          setSearchTerm(search);
        }}
      />
      {userLoading && (
        <div className="flex items-center justify-center h-40">
          <Spin />
        </div>
      )}
      {userData && !userLoading && (
        <div className="my-5">
          <UserList
            setUser={setUser}
            userData={userData || []}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      )}
      {user && <RepositoryList />}
    </div>
  );
};

export default Home;
