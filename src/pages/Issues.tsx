import { useQuery } from "@apollo/client";
import { List, Spin } from "antd";
import { useContext, useState } from "react";
import { FC } from "react";
import { StateContext } from "../context/State";
import { GET_ISSUES } from "../graphql/Query";

const { Item } = List;

const Issues: FC = () => {
  const { repo, user } = useContext(StateContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  const {
    data: issueList,
    loading: issueLoading,
    refetch: refetchIssues,
  } = useQuery(GET_ISSUES, {
    variables: {
      name: repo,
      owner: user,
      first: 10,
      after,
      before,
    },
  });

  if (issueLoading) {
    return <Spin />;
  }

  return (
    <List
      header={<div>Open Issues</div>}
      pagination={{
        current: currentPage,
        total: issueList?.repository?.issues?.totalCount,
        onChange: (page) => {
          if (page < currentPage) {
            setBefore(issueList?.repository?.issues?.pageInfo?.startCursor);
            setAfter(null);
          }
          if (page > currentPage) {
            setBefore(null);
            setAfter(issueList?.repository?.issues?.pageInfo?.endCursor);
          }
          setCurrentPage(page);
          refetchIssues();
        },
        pageSize: 10,
      }}
      dataSource={issueList?.repository?.issues?.nodes}
      renderItem={(item: any) => <Item key={item.name}>{item.name}</Item>}
    />
  );
};

export default Issues;
