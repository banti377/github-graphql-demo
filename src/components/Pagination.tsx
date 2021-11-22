import { FC } from "react";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPrevClick: () => void;
  onNextClick: () => void;
}

const Pagination: FC<Props> = ({ pageInfo, onPrevClick, onNextClick }) => {
  return (
    <div className="flex space-x-4 justify-end">
      <Button
        disabled={!pageInfo.hasPreviousPage}
        className="items-center flex"
        onClick={onPrevClick}
      >
        <CaretLeftOutlined />
        Prev
      </Button>
      <Button
        disabled={!pageInfo.hasNextPage}
        className="items-center flex"
        onClick={onNextClick}
      >
        Next
        <CaretRightOutlined />
      </Button>
    </div>
  );
};

export default Pagination;
