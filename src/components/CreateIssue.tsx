import { Form, FormInstance, Input, Modal } from "antd";
import { FC } from "react";

const { Item } = Form;
const { TextArea } = Input;

interface Props {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  form: FormInstance<any>;
}

const CreateIssue: FC<Props> = ({
  isModalVisible,
  handleCancel,
  handleOk,
  form,
}) => {
  return (
    <Modal
      title="New Issue"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title!" }]}
        >
          <Input placeholder="Enter title" />
        </Item>
        <Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Item>
      </Form>
    </Modal>
  );
};

export default CreateIssue;
