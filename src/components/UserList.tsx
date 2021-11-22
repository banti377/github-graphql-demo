import { Card } from "antd";
import { FC } from "react";

const { Meta } = Card;

interface Props {
  userData: any;
  setUser: (user: string) => void;
}

const UserList: FC<Props> = ({ userData, setUser }) => {
  return (
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
  );
};

export default UserList;
