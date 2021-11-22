import { useQuery } from "@apollo/client";
import { List, Space, Spin } from "antd";
import React, { useContext, useState } from "react";
import { FC } from "react";
import { EyeOutlined, StarOutlined } from "@ant-design/icons";

import { GET_REPOSITORIES } from "../graphql/Query";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../context/State";
import Pagination from "../components/Pagination";

const { Item } = List;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space align="end">
    {React.createElement(icon)}
    {text}
  </Space>
);

const RepositoryList: FC = () => {
  const { user, setRepoId, setRepo } = useContext(StateContext);

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

  const onPrevClick = () => {
    setBefore(repositoryList?.user?.repositories?.pageInfo?.startCursor);
    setAfter(null);
    refetchRepositories();
  };

  const onNextClick = () => {
    setBefore(null);
    setAfter(repositoryList?.user?.repositories?.pageInfo?.endCursor);
    refetchRepositories();
  };

  if (repositoryLoading) {
    return <Spin />;
  }

  return (
    <>
      <List
        header={<div>Repositories</div>}
        dataSource={repositoryList?.user.repositories.nodes}
        renderItem={(item: any) => (
          <Item
            onClick={() => {
              setRepo(item.name);
              setRepoId(item.id);
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
      {repositoryList?.user.repositories.nodes && (
        <Pagination
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          pageInfo={repositoryList?.user?.repositories?.pageInfo}
        />
      )}
    </>
  );
};

export default RepositoryList;
