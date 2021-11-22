import { FC } from "react";
import { Button, Card } from "antd";

const { Meta } = Card;

interface Props {
  userData: any;
  setUser: (user: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const UserList: FC<Props> = ({ userData, setUser, onPrev, onNext }) => {
  return (
    <div>
      <div className="flex space-x-4">
        {userData?.search?.edges?.map(({ node: user }: any) => (
          <Card
            key={user.login}
            hoverable
            style={{ width: 240 }}
            cover={<img alt={user.name} src={user.avatarUrl} />}
            onClick={() => setUser(user.login)}
          >
            <Meta title={user.login} />
          </Card>
        ))}
      </div>
      <Button
        disabled={!userData.search.pageInfo.hasPreviousPage}
        onClick={onPrev}
      >
        Prev
      </Button>
      <Button
        disabled={!userData.search.pageInfo.hasNextPage}
        onClick={onNext}
      >
        Next
      </Button>
    </div>

  );
};

export default UserList;
