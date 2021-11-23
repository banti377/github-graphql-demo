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
} from "../reducers/pagination";

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

  const {
    data: repositoryList,
    loading: repositoryLoading,
    error: repositoryError
  } = useQuery(
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

  let repositoryView = null;
  if (repositoryLoading) {
    repositoryView = (
      <div className="h-full w-full flex items-center justify-center">
        <Spin tip="Getting repositories..." />
      </div>
    );
  } else if (repositoryList) {
    repositoryView = (
      <>
        <List
          dataSource={repositoryList.user.repositories.nodes}
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
          <Pagination
            pageInfo={repositoryList?.user?.repositories?.pageInfo}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      </>
    );
  } else if (repositoryError) {
    repositoryView = (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-red-600">{repositoryError.message || 'Something went wrong,'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex space-x-3 items-center mb-4">
        <h4 className="font-semibold text-3xl">Repositories</h4>
        { repositoryList ? (
          <span className="text-xl font-medium rounded-full h-10 w-10 flex items-center justify-center bg-yellow-500 text-black">
            {repositoryList.user.repositories.totalCount}
          </span>
        ) : null}
      </div>
      {repositoryView}
    </div>
  );
};

export default RepositoryList;
