import { Input } from "antd";
import { FC } from "react";

const { Search } = Input;

interface Props {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: FC<Props> = ({ searchTerm, setSearchTerm }) => {
  const onSearch = (value: string) => setSearchTerm(value);

  return (
    <Search
      value={searchTerm}
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onChange={(e) => setSearchTerm(e.target.value)}
      onSearch={onSearch}
    />
  );
};

export default SearchBar;
