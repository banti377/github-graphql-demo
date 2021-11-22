import { useLazyQuery } from "@apollo/client";
import { FC, useContext, useEffect, useReducer, useState } from "react";
import { Spin } from "antd";
import { SEARCH_USER } from "../graphql/Query";
import RepositoryList from "../components/RepositoryList";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import { StateContext } from "../context/State";
import paginationReducer, { initialState } from "../reducers/pagination.reducer";

const Home: FC = () => {
  const { user, setUser } = useContext(StateContext);

  const [userPagination, userPaginationDispatch] = useReducer(paginationReducer, initialState);

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

  useEffect(() => {
    if (searchTerm) {
      searchUser();
    }
  }, [searchTerm, searchUser]);

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(search) => {
          // When search changes move user to page 1.
          userPaginationDispatch({ type: 'reset' });
          setSearchTerm(search);
        }}
      />
      {userLoading && <Spin />}
      {userData && !userLoading && (
        <UserList
          setUser={setUser}
          userData={userData || []}
          onPrev={() => {
            userPaginationDispatch({
              type: 'prev',
              payload: {
                before: userData.search.pageInfo.startCursor
              }
            });
          }}
          onNext={() => {
            userPaginationDispatch({
              type: 'next',
              payload: {
                after: userData.search.pageInfo.endCursor
              }
            });
          }}
        />
      )}
      {user && <RepositoryList />}
    </div>
  );
};

export default Home;
