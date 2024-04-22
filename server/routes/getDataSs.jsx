// const express = require("express");
// const mysql = require("mysql");
// const router = express.Router();
// const moment = require("moment");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "iot",
// });

// // Get all data sensor and paging page
// router.get("/", (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   const query = "SELECT * FROM datass LIMIT ? OFFSET ?";

//   db.query(query, [limit, offset], (err, results) => {
//     if (err) {
//       console.error("Error retrieving data:", err);
//       res.status(500).json({ error: "Error retrieving data" });
//     } else {
//       res.status(200).json({
//         message: "Successfully",
//         data: results,
//       });
//     }
//   });
// });

// router.get("/sort", (req, res) => {
//   const sortBy = req.query.sortBy; // Cột mà người dùng muốn sắp xếp
//   const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC"; // Hướng sắp xếp, mặc định là ASC

//   // Kiểm tra xem người dùng đã cung cấp cột sắp xếp hay không
//   if (!sortBy) {
//     return res
//       .status(400)
//       .json({ error: "Please provide a column to sort by" });
//   }

//   // Kiểm tra xem cột sắp xếp có hợp lệ hay không (để tránh SQL injection)
//   const validColumns = ["id", "temperature", "humidity", "light", "createAt"];
//   if (!validColumns.includes(sortBy)) {
//     return res.status(400).json({ error: "Invalid column to sort by" });
//   }

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   const baseQuery = `SELECT * FROM datass`;

//   const query = `
//     SELECT * FROM (
//       ${baseQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ${offset}, ${limit}
//     ) AS sorted_data
//     ORDER BY ${sortBy} ${sortOrder}
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error sorting data:", err);
//       res.status(500).json({ error: "Error sorting data" });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

// router.get("/filter", (req, res) => {
//   let { startDate, endDate, page, limit } = req.query;

//   endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
//   endDate = moment(endDate).subtract(1, "second").format("YYYY-MM-DD HH:mm:ss");

//   if (!startDate || !endDate) {
//     return res
//       .status(400)
//       .json({ error: "Thiếu tham số startDate hoặc endDate" });
//   }

//   page = parseInt(page) || 1;
//   limit = parseInt(limit) || 10;
//   const offset = (page - 1) * limit;

//   const sql =
//     "SELECT * FROM datass WHERE createAt BETWEEN ? AND ? LIMIT ? OFFSET ?";
//   const values = [startDate, endDate, limit, offset];

//   db.query(sql, values, (error, results) => {
//     if (error) {
//       console.error("Error executing query:", error);
//       return res.status(500).json({ error: "Lỗi khi truy vấn dữ liệu" });
//     }
//     res.json(results);
//   });
// });

// router.get("/search", (req, res) => {
//   const { term, option, page, limit } = req.query; // Thêm page và limit vào query string

//   const itemsPerPage = parseInt(limit) || 10; // Số dữ liệu trên mỗi trang, mặc định là 10
//   const offset = (parseInt(page) || 1 - 1) * itemsPerPage; // Độ lệch cho mỗi trang

//   let query = "";
//   switch (option) {
//     case "temperature":
//     case "humidity":
//     case "light":
//       query = `
//         SELECT * FROM datass
//         WHERE ${option} = '${term}'
//         ORDER BY createAt DESC
//         LIMIT ${itemsPerPage} OFFSET ${offset}
//       `;
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid option" });
//   }
//   console.log(query);

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error searching data:", err);
//       res.status(500).json({ error: "Error searching data" });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

// module.exports = router;

const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const moment = require("moment");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "iot",
});

// Middleware function to handle errors
function handleQueryError(res, error, message) {
  console.error(message, error);
  res.status(500).json({ error: message });
}

// Get all data sensor with pagination
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM datass LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      handleQueryError(res, err, "Error retrieving data");
    } else {
      res.status(200).json({
        message: "Successfully",
        data: results,
      });
    }
  });
});

// Get sorted data
router.get("/sort", (req, res) => {
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

  if (!sortBy) {
    return res
      .status(400)
      .json({ error: "Please provide a column to sort by" });
  }

  const validColumns = ["id", "temperature", "humidity", "light", "createAt"];
  if (!validColumns.includes(sortBy)) {
    return res.status(400).json({ error: "Invalid column to sort by" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM datass
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ${offset}, ${limit}
  `;

  db.query(query, (err, results) => {
    if (err) {
      handleQueryError(res, err, "Error sorting data");
    } else {
      res.status(200).json(results);
    }
  });
});

// Filter data by date range
router.get("/filter", (req, res) => {
  let { startDate, endDate, page, limit } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Missing startDate or endDate parameter" });
  }

  endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
  endDate = moment(endDate).subtract(1, "second").format("YYYY-MM-DD HH:mm:ss");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT * FROM datass 
    WHERE createAt BETWEEN ? AND ? 
    LIMIT ? OFFSET ?
  `;
  const values = [startDate, endDate, limit, offset];

  db.query(sql, values, (error, results) => {
    if (error) {
      handleQueryError(res, error, "Error executing query");
    } else {
      res.json(results);
    }
  });
});

// Search data
router.get("/search", (req, res) => {
  const { term, option, page, limit } = req.query;

  const itemsPerPage = parseInt(limit) || 10;
  const offset = (parseInt(page) || 1 - 1) * itemsPerPage;

  // Chuyển đổi biến term sang kiểu số thực
  const termFloat = parseFloat(term);

  console.log(typeof termFloat, termFloat);

  // Kiểm tra xem liệu term có phải là một số hợp lệ không
  if (isNaN(termFloat)) {
    return res.status(400).json({ error: "Invalid term" });
  }

  let query = "";
  switch (option) {
    case "temperature":
    case "humidity":
    case "light":
      query = `
                SELECT * FROM datass
                WHERE ${option} = ?
                ORDER BY createAt DESC
                LIMIT ?, ?
            `;
      db.query(query, [termFloat, offset, itemsPerPage], (err, results) => {
        if (err) {
          handleQueryError(res, err, "Error searching data");
        } else {
          res.status(200).json(results);
        }
      });
      break;
    default:
      return res.status(400).json({ error: "Invalid option" });
  }
});

module.exports = router;
