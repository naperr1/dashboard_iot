import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./DataSs.css";
import { FaSort } from "react-icons/fa";
import Search from "../Search/Search";

const DataSs = () => {
  const [sensorData, setSensorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("temperature");

  const dataSearch = [
    {
      name: "temperature",
      value: "Temperature",
    },
    {
      name: "humidity",
      value: "Humidity",
    },
    {
      name: "light",
      value: "Light",
    },
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/get-data-sensor?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => setSensorData(data.data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(sensorData);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSort = async (columnName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-data-sensor/sort?sortBy=${columnName}`
      );
      const sortedData = await response.json();
      setSensorData(sortedData);
    } catch (error) {
      console.error("Error sorting data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-data-sensor/search?term=${searchTerm}&option=${selectedOption}&page=${currentPage}`
      );
      const searchData = await response.json();
      setSensorData(searchData);
    } catch (error) {
      console.error("Error searching data:", error);
    }
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

  // useEffect(() => {
  //   handleSearch();
  // }, [selectedOption, searchTerm, currentPage]);

  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
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
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID <FaSort />
            </th>
            <th onClick={() => handleSort("temperature")}>
              Temperature <FaSort />
            </th>
            <th onClick={() => handleSort("humidity")}>
              Humidity <FaSort />
            </th>
            <th onClick={() => handleSort("light")}>
              Light <FaSort />
            </th>
            <th onClick={() => handleSort("createAt")}>
              CreatedAt <FaSort />
            </th>
          </tr>
        </thead>
        <tbody>
          {sensorData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.temperature}</td>
              <td>{item.humidity}</td>
              <td>{item.light}</td>
              <td>{new Date(item.createAt).toLocaleString()}</td>{" "}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default DataSs;
