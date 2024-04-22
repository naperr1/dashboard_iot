import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./History.css";
import { FaSort } from "react-icons/fa";
import Search from "../Search/Search";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const dataSearch = [
    // { name: "all", value: "All" },
    { name: "device", value: "Device" },
    { name: "status", value: "Status" },
  ];

  const handleSort = (columnName) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    fetchData(columnName, currentPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      <Search onSearch={handleSearch} dataSearch={dataSearch} />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("device")}>
                Tên Thiết Bị
                <FaSort />
              </th>
              <th onClick={() => handleSort("status")}>
                Trạng Thái <FaSort />
              </th>
              <th onClick={() => handleSort("date")}>
                Thời gian <FaSort />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(historyData) &&
              historyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.device}</td>
                  <td>{item.status}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
