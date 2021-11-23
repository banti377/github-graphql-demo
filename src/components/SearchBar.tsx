import { Input } from "antd";
import { FC } from "react";

const { Search } = Input;

interface Props {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  className?: string;
}

const SearchBar: FC<Props> = ({ searchTerm, setSearchTerm, className }) => {
  const onSearch = (value: string) => setSearchTerm(value);

  return (
    <Search
      className={className}
      value={searchTerm}
      placeholder="input search text"
      allowClear
      size="large"
      onChange={(e) => {
        setSearchTerm(e.target.value);
      }}
      onSearch={onSearch}
    />
  );
};

export default SearchBar;
