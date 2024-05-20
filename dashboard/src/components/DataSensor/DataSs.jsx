import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./DataSs.css";
import { FaSort } from "react-icons/fa";
import { DatePicker, Space } from "antd";
import DateFilter from "../DateFilter/DateFilter";
import dayjs from "dayjs";
import axios from "axios";

const DataSs = () => {
  const [sensorData, setSensorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("temperature");

  const { RangePicker } = DatePicker;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dataSearch = [
    {
      name: "all",
      value: "All",
    },
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
    {
      name: "date",
      value: "Date",
    },
    {
      name: "wind",
      value: "Wind",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (startDate !== "" && endDate !== "") {
          const response = await axios.get(
            `http://localhost:5000/get-data-sensor/filter?startDate=${startDate}&endDate=${endDate}&page=${currentPage}`
          );
          setSensorData(response.data);
        } else {
          const response = await fetch(
            `http://localhost:5000/get-data-sensor?page=${currentPage}`
          );
          const data = await response.json();
          setSensorData(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, currentPage]);

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
      if (!searchTerm.trim()) {
        return; // Không làm gì nếu trường tìm kiếm là rỗng
      }
      const response = await fetch(
        `http://localhost:5000/get-data-sensor/search?term=${searchTerm}&option=${selectedOption}`
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

  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      <div className="search">
        <div style={{ marginRight: "10px" }}>
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={(e) => {
                setStartDate(dayjs(e[0].$d).format("YYYY-MM-DD"));
                setEndDate(dayjs(e[1].$d).format("YYYY-MM-DD"));
              }}
            />
          </Space>
        </div>
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
            <th onClick={() => handleSort("wind_speed")}>
              Wind_speed <FaSort />
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
              <td>{item.wind_speed}</td>
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
