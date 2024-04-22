// import React, { useState, useEffect } from "react";
// import Header from "../Header/Header";
// import "./History.css";
// import { FaSort } from "react-icons/fa";
// import Search from "../Search/Search";
// import axios from "axios";
// import { DatePicker, Space } from "antd";
// import DateFilter from "../DateFilter/DateFilter";
// import dayjs from "dayjs";

// const History = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const { RangePicker } = DatePicker;
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const dataSearch = [
//     { name: "device", value: "Device" },
//     { name: "status", value: "Status" },
//   ];

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]); // Fetch data khi currentPage thay đổi

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/get-action-history?page=${currentPage}`
//       );
//       setHistoryData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleNextPage = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(currentPage - 1);
//   };

//   const handleSearch = async (searchTerm, selectedOption) => {
//     console.log(selectedOption);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/get-action-history/search?searchTerm=${searchTerm}&selectedOption=${selectedOption}&page=${currentPage}`
//       );
//       setHistoryData(response.data);
//     } catch (error) {
//       console.error("Error searching data:", error);
//     }
//   };

//   const handleSort = async (field) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/get-action-history/sort?sortBy=${field}`
//       );
//       setHistoryData(response.data);
//     } catch (error) {
//       console.error("Error sorting data:", error);
//     }
//   };

//   return (
//     <div className="container" style={{ height: "calc(100vh - 75px)" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "right",
//         }}
//       >
//         <div style={{ marginRight: "10px" }}>
//           <Space direction="vertical" size={12}>
//             <RangePicker
//               onChange={(e) => {
//                 setStartDate(dayjs(e[0].$d).format("YYYY-MM-DD"));
//                 setEndDate(dayjs(e[1].$d).format("YYYY-MM-DD"));
//               }}
//             />
//           </Space>
//         </div>
//         <Search onSearch={handleSearch} dataSearch={dataSearch} />
//       </div>
//       <div>
//         <table className="table">
//           <thead>
//             <tr>
//               <th onClick={() => handleSort("device")}>
//                 Device
//                 <FaSort />
//               </th>
//               <th onClick={() => handleSort("status")}>
//                 Status <FaSort />
//               </th>
//               <th onClick={() => handleSort("date")}>
//                 Date <FaSort />
//               </th>
//               <th onClick={() => handleSort("ledId")}>
//                 Led ID <FaSort />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {historyData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.device}</td>
//                 <td>{item.status}</td>
//                 <td>{item.date}</td>
//                 <td>{item.ledId}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="pagination">
//           <button onClick={handlePrevPage} disabled={currentPage === 1}>
//             Previous
//           </button>
//           <span>Page {currentPage}</span>
//           <button onClick={handleNextPage}>Next</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;

import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import axios from "axios";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

import Search from "../Search/Search";
import "./History.css";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { RangePicker } = DatePicker;

  const dataSearch = [
    { name: "device", value: "Device" },
    { name: "status", value: "Status" },
  ];

  // useEffect(() => {
  //   fetchData();
  // }, [currentPage, startDate, endDate]); // Fetch data khi currentPage hoặc khoảng thời gian thay đổi

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/get-action-history/filter?startDate=${startDate}&endDate=${endDate}&page=${currentPage}`
  //     );
  //     setHistoryData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data khi component được render lần đầu tiên

  useEffect(() => {
    fetchData();
  }, [currentPage, startDate, endDate]);

  const fetchData = async () => {
    try {
      let url = `http://localhost:5000/get-action-history`;

      // Thêm tham số cho khoảng thời gian nếu có
      if (startDate && endDate) {
        url += `/filter?startDate=${startDate}&endDate=${endDate}`;
      } else {
        url += `?page=${currentPage}`;
      }

      // Thêm trang nếu currentPage > 1
      if (currentPage > 1) {
        url += `&page=${currentPage}`;
      }

      const response = await axios.get(url);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  setStartDate(dayjs(dates[0]).format("YYYY-MM-DD"));
                  setEndDate(dayjs(dates[1]).format("YYYY-MM-DD"));
                }
              }}
            />
          </Space>
        </div>
        <Search onSearch={handleSearch} dataSearch={dataSearch} />
      </div>
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
