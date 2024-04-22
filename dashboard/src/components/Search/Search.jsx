import React, { useState } from "react";
import "./Search.css";

const Search = ({ onSearch, dataSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(dataSearch[0].name);
  const handleSearch = () => {
    onSearch(searchTerm, selectedOption);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        required
      />
      <div className="search_options">
        <select value={selectedOption} onChange={handleOptionChange}>
          {dataSearch.map((item) => (
            <option key={item.name} value={item.name}>
              {item.value}
            </option>
          ))}
        </select>
      </div>
      <div className="search_icon">
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Search;
