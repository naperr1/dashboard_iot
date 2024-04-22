import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./History.css";
import { FaSort } from "react-icons/fa";
import Search from "../Search/Search";
import axios from "axios";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const dataSearch = [
    { name: "device", value: "Device" },
    { name: "status", value: "Status" },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Fetch data khi currentPage thay đổi

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-action-history?page=${currentPage}`
      );
      setHistoryData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearch = async (searchTerm, selectedOption) => {
    console.log(selectedOption);
    try {
      const response = await axios.get(
        `http://localhost:5000/get-action-history/search?searchTerm=${searchTerm}&selectedOption=${selectedOption}&page=${currentPage}`
      );
      setHistoryData(response.data);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const handleSort = async (field) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-action-history/sort?sortBy=${field}`
      );
      setHistoryData(response.data);
    } catch (error) {
      console.error("Error sorting data:", error);
    }
  };

  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      <Search onSearch={handleSearch} dataSearch={dataSearch} />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("device")}>
                Device
                <FaSort />
              </th>
              <th onClick={() => handleSort("status")}>
                Status <FaSort />
              </th>
              <th onClick={() => handleSort("date")}>
                Date <FaSort />
              </th>
              <th onClick={() => handleSort("ledId")}>
                Led ID <FaSort />
              </th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={index}>
                <td>{item.device}</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
                <td>{item.ledId}</td>
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
    </div>
  );
};

export default History;
