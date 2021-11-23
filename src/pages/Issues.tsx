import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, List, notification, Spin } from "antd";
import moment from "moment";
import { useContext, useEffect, useReducer, useState } from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { StateContext } from "../context/State";
import { CREATE_ISSUE } from "../graphql/Mutation";
import { GET_ISSUES } from "../graphql/Query";
import CreateIssue from "../components/CreateIssue";
import paginationReducer, {
  initialState,
} from "../reducers/pagination";
import Pagination from "../components/Pagination";

import { IIssueITem } from "../interfaces";

const { Item } = List;

const Issues: FC = () => {
  const { repo, user, repoId, reset } = useContext(StateContext);

  const navigate = useNavigate();

  const [issuePagination, issuePaginationDispatch] = useReducer(
    paginationReducer,
    initialState
  );
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: issueList,
    loading: issueLoading,
    error: issueError,
    refetch: refetchIssues,
  } = useQuery(GET_ISSUES, {
    variables: {
      name: repo,
      owner: user,
      first: issuePagination.first,
      after: issuePagination.after,
      before: issuePagination.before,
      last: issuePagination.last,
    },
  });

  const [createIssue] = useMutation(CREATE_ISSUE);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const { title, description } = form.getFieldsValue();
    if (title) {
      createIssue({
        variables: {
          repositoryId: repoId,
          title,
          body: description,
        },
      })
        .then(() => {
          refetchIssues();
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch((err) => {
          const notificationArgs = {
            message: 'Couldn\'t save issue!',
            description: err.message || 'Something went wrong, Couldn\'t save issue.',
            duration: 2,
          };
          notification.open(notificationArgs);
        });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onPrev = () => {
    issuePaginationDispatch({
      type: "prev",
      payload: {
        before: issueList.repository.issues.pageInfo.startCursor,
      },
    });
  };

  const onNext = () => {
    issuePaginationDispatch({
      type: "next",
      payload: {
        after: issueList.repository.issues.pageInfo.endCursor,
      },
    });
  };

  const onBack = () => {
    reset();
    navigate("/");
  };

  useEffect(() => {
    if (!repo) {
      navigate("/", { replace: true });
    }
  }, [repo, navigate]);

  let issueView = null;
  if (issueLoading) {
    issueView = (
      <div className="w-full h-full flex items-start justify-center">
        <Spin tip="Getting issues..." />
      </div>
    );
  } else if (issueList) {
    issueView = (
      <>
        <List
          dataSource={issueList.repository.issues.nodes}
          renderItem={({ title, createdAt, author: { login } }: IIssueITem) => (
            <Item className="pt-5" key={title}>
              <div className="font-medium text-base">{title}</div>
              <div className="text-gray-500 font-normal">
                {moment(createdAt).fromNow()} by {login}
              </div>
            </Item>
          )}
        />
        <Pagination
          pageInfo={issueList.repository.issues.pageInfo}
          onNext={onNext}
          onPrev={onPrev}
        />
      </>
    ) 
  } else if (issueError) {
    issueView = (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-red-600">{issueError.message || 'Something went wrong,'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto h-screen p-10">
      <div className="mb-6 flex flex-col justify-center space-y-1">
        <h4 className="font-extrabold text-3xl w-max">{repo}</h4>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-base space-x-2 hover:text-blue-500 w-max"
        >
          <ArrowLeftOutlined />
          <span>Go Back</span>
        </button>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-3 items-center">
          <h4 className="font-semibold text-2xl">Open Issues</h4>
          { issueList ? (
          <span className="text-xl font-medium rounded-full h-10 w-10 flex items-center justify-center bg-yellow-500 text-black">
            {issueList.repository.issues.totalCount}
          </span>
        ) : null}
        </div>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          New Issue
        </Button>
      </div>
      {issueView}
      <CreateIssue
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleOk={handleOk}
        form={form}
      />
    </div>
  );
};

export default Issues;
