import { Button } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { FC } from "react";

interface Props {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: FC<Props> = ({
  pageInfo: { hasNextPage, hasPreviousPage },
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex space-x-4 justify-end">
      <Button
        disabled={!hasPreviousPage}
        className="items-center flex"
        onClick={onPrev}
      >
        <CaretLeftOutlined />
        Prev
      </Button>
      <Button
        disabled={!hasNextPage}
        className="items-center flex"
        onClick={onNext}
      >
        Next
        <CaretRightOutlined />
      </Button>
    </div>
  );
};

export default Pagination;
