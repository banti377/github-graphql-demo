import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, List, Spin } from "antd";
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
} from "../reducers/pagination.reducer";
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
        .catch((err) => console.log(err));
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

  if (issueLoading) {
    return <Spin />;
  }

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-100 h-screen">
      <div className="flex items-center text-base mb-4">
        <ArrowLeftOutlined onClick={onBack} className="mr-2" /> Go Back
      </div>
      <div className="font-extrabold text-2xl mb-4">{repo}</div>
      <div className="flex justify-between">
        <div className="text-xl font-semibold">Open Issues</div>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          New Issue
        </Button>
      </div>
      <List
        dataSource={issueList?.repository?.issues?.nodes}
        renderItem={({ title, createdAt, author: { login } }: IIssueITem) => (
          <Item className="pt-5 text-md font-semibold" key={title}>
            <div>{title}</div>
            <div>
              {moment(createdAt).fromNow()} by {login}
            </div>
          </Item>
        )}
      />
      {issueList?.repository?.issues?.nodes?.length ? (
        <Pagination
          pageInfo={issueList.repository.issues.pageInfo}
          onNext={onNext}
          onPrev={onPrev}
        />
      ) : null}
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
