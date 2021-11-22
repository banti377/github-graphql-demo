import { useLazyQuery } from "@apollo/client";
import { FC, useContext, useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import { SEARCH_USER } from "../graphql/Query";
import RepositoryList from "../components/RepositoryList";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";
import { StateContext } from "../context/State";

const Home: FC = () => {
  const { user, setUser, setRepo } = useContext(StateContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const onPageChange = (page: number) => {
    console.log(currentPage, page);
    if (page > currentPage) {
      setAfter(userData?.search?.pageInfo?.endCursor);
      setBefore(null);
    }
    if (page <= currentPage) {
      setBefore(userData?.search?.pageInfo?.startCursor);
      setAfter(null);
    }
    setCurrentPage(page);
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
          pageSize={5}
          current={currentPage}
          onChange={onPageChange}
          total={userData?.search?.userCount}
          showSizeChanger={false}
        />
      )}
      {user && <RepositoryList user={user} setRepo={setRepo} />}
    </div>
  );
};

export default Home;
