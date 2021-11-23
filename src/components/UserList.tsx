import { FC } from "react";
import { Card } from "antd";

import Pagination from "../components/Pagination";

import { IUser, IUserData } from "../interfaces";

const { Meta } = Card;

interface Props {
  userData: IUserData;
  setUser: (user: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const UserList: FC<Props> = ({ userData, setUser, onPrev, onNext }) => {
  return (
    <div>
      <div className="flex space-x-4">
        {userData?.search?.edges?.map(
          ({ node: { login, name, avatarUrl } }: IUser) => (
            <Card
              key={login}
              hoverable
              style={{ width: 240 }}
              cover={<img alt={name} src={avatarUrl} />}
              onClick={() => setUser(login)}
            >
              <Meta title={login} />
            </Card>
          )
        )}
      </div>
      <div className="my-4 mr-4">
        {userData?.search?.edges?.length ? (
          <Pagination
            onNext={onNext}
            onPrev={onPrev}
            pageInfo={userData?.search?.pageInfo}
          />
        ) : null}
      </div>
    </div>
  );
};

export default UserList;
