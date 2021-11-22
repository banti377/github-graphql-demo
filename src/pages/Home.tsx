import { useLazyQuery } from "@apollo/client";
import { FC, useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { SEARCH_USER } from "../graphql/Query";
import RepositoryList from "../components/RepositoryList";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import { StateContext } from "../context/State";
import Pagination from "../components/Pagination";

const Home: FC = () => {
  const { user, setUser } = useContext(StateContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  const [searchUser, { data: userData, loading: userLoading }] = useLazyQuery(
    SEARCH_USER,
    {
      variables: {
        query: searchTerm,
        type: "USER",
        first: 5,
        after,
        before,
      },
    }
  );

  const onPrevClick = () => {
    setBefore(userData?.search?.pageInfo?.startCursor);
    setAfter(null);
    searchUser();
  };

  const onNextClick = () => {
    setAfter(userData?.search?.pageInfo?.endCursor);
    setBefore(null);
    searchUser();
  };

  useEffect(() => {
    if (searchTerm) {
      searchUser();
    }
  }, [searchTerm, searchUser]);

  return (
    <div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {userLoading && <Spin />}
      {userData && !userLoading && (
        <UserList setUser={setUser} userData={userData || []} />
      )}
      {userData && (
        <Pagination
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          pageInfo={userData?.search?.pageInfo}
        />
      )}
      {user && <RepositoryList />}
    </div>
  );
};

export default Home;
