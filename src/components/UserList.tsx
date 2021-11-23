import { FC } from "react";
import { Card } from "antd";
import classNames from 'classnames';

import Pagination from "../components/Pagination";

import { IUser, IUserData } from "../interfaces";

const { Meta } = Card;

interface Props {
  userData: IUserData;
  setUser: (user: string) => void;
  onPrev: () => void;
  onNext: () => void;
  selectedUser: string;
}

const UserList: FC<Props> = ({ userData, setUser, onPrev, onNext, selectedUser }) => {
  return (
    <div>
      <div className="flex items-center justify-center space-x-4">
        {userData.search.edges.length ? userData.search.edges.map(
          ({ node: { login, name, avatarUrl } }: IUser) => (
            <Card
              className={classNames(
                `rounded-2xl overflow-hidden`,
                { 'ring-2 ring-blue-500 ring-offset-4': login === selectedUser }
              )}
              key={login}
              hoverable
              style={{ width: 240 }}
              cover={<img alt={name} src={avatarUrl} />}
              onClick={() => setUser(login)}
            >
              <Meta title={login} />
            </Card>
          )
        ): (
          <div className="text-center text-lg font-medium">No users found.</div>
        )}
      </div>
      <div className="my-4 mr-4">
        {userData.search.edges.length ? (
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
