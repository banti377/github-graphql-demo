import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, List, Spin } from "antd";
import moment from "moment";
import { useContext, useState } from "react";
import { FC } from "react";
import { StateContext } from "../context/State";
import { CREATE_ISSUE } from "../graphql/Mutation";
import { GET_ISSUES } from "../graphql/Query";
import Pagination from "../components/Pagination";
import CreateIssue from "../components/CreateIssue";
import { IITem } from "../interfaces";

const { Item } = List;

const Issues: FC = () => {
  const { repo, user, repoId } = useContext(StateContext);

  const [form] = Form.useForm();

  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      });
      refetchIssues();
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onPrevClick = () => {
    setBefore(issueList?.repository?.issues?.pageInfo?.startCursor);
    setAfter(null);
    refetchIssues();
  };

  const onNextClick = () => {
    setBefore(null);
    setAfter(issueList?.repository?.issues?.pageInfo?.endCursor);
    refetchIssues();
  };

  if (issueLoading) {
    return <Spin />;
  }

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-100 h-screen">
      <div className="font-extrabold text-2xl mb-4">{repo}</div>
      <div className="flex justify-between">
        <div className="text-xl font-semibold">Open Issues</div>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          New Issue
        </Button>
      </div>
      <List
        dataSource={issueList?.repository?.issues?.nodes}
        renderItem={({ title, createdAt, author: { login } }: IITem) => (
          <Item className="pt-5 text-md font-semibold" key={title}>
            <div>{title}</div>
            <div>
              {moment(createdAt).fromNow()} by {login}
            </div>
          </Item>
        )}
      />
      {issueList?.repository?.issues?.nodes && (
        <Pagination
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          pageInfo={issueList?.repository?.issues?.pageInfo}
        />
      )}
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
