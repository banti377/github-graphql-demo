import { useQuery } from "@apollo/client";
import { List, Space, Spin } from "antd";
import React, { useReducer, useContext } from "react";
import { FC } from "react";
import { EyeOutlined, StarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import Pagination from "../components/Pagination";
import { GET_REPOSITORIES } from "../graphql/Query";
import { StateContext } from "../context/State";
import paginationReducer, {
  initialState,
} from "../reducers/pagination.reducer";

import { IRepoItem } from "../interfaces";

const { Item } = List;

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <Space align="end" className="text-base font-semibold flex items-center">
    <div>{React.createElement(icon)}</div>
    <div>{text}</div>
  </Space>
);

const RepositoryList: FC = () => {
  const { user, setRepoId, setRepo } = useContext(StateContext);
  const navigate = useNavigate();

  const [repoPagiantion, repoPaginationDispatch] = useReducer(
    paginationReducer,
    initialState
  );

  const { data: repositoryList, loading: repositoryLoading } = useQuery(
    GET_REPOSITORIES,
    {
      variables: {
        login: user,
        first: repoPagiantion.first,
        after: repoPagiantion.after,
        before: repoPagiantion.before,
        last: repoPagiantion.last,
      },
    }
  );

  const onPrev = () => {
    repoPaginationDispatch({
      type: "prev",
      payload: {
        before: repositoryList.user.repositories.pageInfo.startCursor,
      },
    });
  };

  const onNext = () => {
    repoPaginationDispatch({
      type: "next",
      payload: {
        after: repositoryList.user.repositories.pageInfo.endCursor,
      },
    });
  };

  if (repositoryLoading) {
    return <Spin />;
  }

  return (
    <div>
      <div className="text-2xl font-bold">Repositories</div>
      <List
        dataSource={repositoryList?.user.repositories.nodes}
        renderItem={({
          name,
          id,
          stargazerCount,
          watchers: { totalCount },
        }: IRepoItem) => (
          <Item
            className="cursor-pointer"
            onClick={() => {
              setRepo(name);
              setRepoId(id);
              navigate("/issues");
            }}
            key={name}
            actions={[
              <IconText
                icon={StarOutlined}
                text={stargazerCount.toString()}
                key="list-vertical-star-o"
              />,
              <IconText
                icon={EyeOutlined}
                text={totalCount.toString()}
                key="list-vertical-like-o"
              />,
            ]}
          >
            <div className="text-base font-semibold">{name}</div>
          </Item>
        )}
      />
      <div className="my-4 mr-4">
        {repositoryList?.user.repositories.nodes?.length ? (
          <Pagination
            pageInfo={repositoryList?.user?.repositories?.pageInfo}
            onPrev={onPrev}
            onNext={onNext}
          />
        ) : null}
      </div>
    </div>
  );
};

export default RepositoryList;
