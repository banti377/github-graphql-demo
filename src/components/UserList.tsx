import { Card } from "antd";
import { FC } from "react";

const { Meta } = Card;

interface Props {
  userData: any;
}

const UserList: FC<Props> = ({ userData }) => {
  return (
    <div className="flex space-x-4">
      {userData?.search?.edges?.map(({ node: user }: any) => (
        <Card
          key={user.login}
          hoverable
          style={{ width: 240 }}
          cover={<img alt={user.name} src={user.avatarUrl} />}
        >
          <Meta title={user.login} />
        </Card>
      ))}
    </div>
  );
};

export default UserList;
