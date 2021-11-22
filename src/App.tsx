import { useLazyQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import UserList from "./components/UserList";
import Repository from "./components/Repository";
import SearchBar from "./components/SearchBar";
import { SEARCH_USER } from "./graphql/Query";
import { Pagination, Spin } from "antd";

const App: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  const [
    searchUser,
    { data: userData, loading: userLoading, error: userError },
  ] = useLazyQuery(SEARCH_USER, {
    variables: {
      query: searchTerm,
      type: "USER",
      first: 5,
      after,
      before,
    },
  });

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
      {userData && !userLoading && <UserList userData={userData || []} />}
      {userData && (
        <Pagination
          pageSize={5}
          current={currentPage}
          onChange={onPageChange}
          total={userData?.search?.userCount}
          showSizeChanger={false}
        />
      )}
      <Repository />
    </div>
  );
};

export default App;
