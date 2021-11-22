import { useQuery } from "@apollo/client";
import { Button, List, Space, Spin } from "antd";
import React, { useReducer, useContext } from "react";
import { FC } from "react";
import { EyeOutlined, StarOutlined } from "@ant-design/icons";

import { GET_REPOSITORIES } from "../graphql/Query";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../context/State";
import paginationReducer, { initialState } from "../reducers/pagination.reducer";

const { Item } = List;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space align="end">
    {React.createElement(icon)}
    {text}
  </Space>
);

const RepositoryList: FC = () => {
  const { user, setRepoId, setRepo } = useContext(StateContext);
  const navigate = useNavigate();

  const [repoPagiantion, repoPaginationDispatch] = useReducer(paginationReducer, initialState);

  const {
    data: repositoryList,
    loading: repositoryLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refetch: refetchRepositories,
  } = useQuery(GET_REPOSITORIES, {
    variables: {
      login: user,
      first: repoPagiantion.first,
      after: repoPagiantion.after,
      before: repoPagiantion.before,
      last: repoPagiantion.last,
    },
  });

  if (repositoryLoading) {
    return <Spin />;
  }

  return (
    <div>
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
      <Button
        disabled={!repositoryList.user.repositories.pageInfo.hasPreviousPage}
        onClick={() => {
          repoPaginationDispatch({
            type: 'prev',
            payload: {
              before: repositoryList.user.repositories.pageInfo.startCursor,
            },
          });
        }}
      >
        Prev
      </Button>
      <Button
        disabled={!repositoryList.user.repositories.pageInfo.hasNextPage}
        onClick={() => {
          repoPaginationDispatch({
            type: 'next',
            payload: {
              after: repositoryList.user.repositories.pageInfo.endCursor,
            },
          });
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default RepositoryList;
