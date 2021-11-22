import { useQuery } from "@apollo/client";
import { List, Space, Spin } from "antd";
import React, { useState } from "react";
import { FC } from "react";
import { EyeOutlined, StarOutlined } from "@ant-design/icons";

import { GET_REPOSITORIES } from "../graphql/Query";
import { useNavigate } from "react-router";

const { Item } = List;

interface Props {
  user: string;
  setRepo: (repo: string) => void;
}

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space align="end">
    {React.createElement(icon)}
    {text}
  </Space>
);

const RepositoryList: FC<Props> = ({ user, setRepo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);

  console.log({ user });

  const navigate = useNavigate();

  const {
    data: repositoryList,
    loading: repositoryLoading,
    refetch: refetchRepositories,
  } = useQuery(GET_REPOSITORIES, {
    variables: {
      login: user,
      first: 10,
      after,
      before,
    },
  });

  if (repositoryLoading) {
    return <Spin />;
  }

  return (
    <List
      header={<div>Repositories</div>}
      pagination={{
        current: currentPage,
        total: repositoryList?.user?.repositories?.totalCount,
        onChange: (page) => {
          if (page < currentPage) {
            setBefore(
              repositoryList?.user?.repositories?.pageInfo?.startCursor
            );
            setAfter(null);
          }
          if (page > currentPage) {
            setBefore(null);
            setAfter(repositoryList?.user?.repositories?.pageInfo?.endCursor);
          }
          setCurrentPage(page);
          refetchRepositories();
        },
        pageSize: 10,
      }}
      dataSource={repositoryList?.user.repositories.nodes}
      renderItem={(item: any) => (
        <Item
          onClick={() => {
            setRepo(item.name);
            navigate("/issues");
          }}
          key={item.name}
          actions={[
            <IconText
              icon={StarOutlined}
              text={item?.stargazerCount}
              key="list-vertical-star-o"
            />,
            <IconText
              icon={EyeOutlined}
              text={item?.watchers?.totalCount}
              key="list-vertical-like-o"
            />,
          ]}
        >
          {item.name}
        </Item>
      )}
    />
  );
};

export default RepositoryList;
