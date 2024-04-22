const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "iot",
});

// Get all data sensor and paging page
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM datass LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "Error retrieving data" });
    } else {
      res.status(200).json({
        message: "Successfully",
        data: results,
      });
    }
  });
});

router.get("/sort", (req, res) => {
  const sortBy = req.query.sortBy; // Cột mà người dùng muốn sắp xếp
  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC"; // Hướng sắp xếp, mặc định là ASC

  // Kiểm tra xem người dùng đã cung cấp cột sắp xếp hay không
  if (!sortBy) {
    return res
      .status(400)
      .json({ error: "Please provide a column to sort by" });
  }

  // Kiểm tra xem cột sắp xếp có hợp lệ hay không (để tránh SQL injection)
  const validColumns = ["id", "temperature", "humidity", "light", "createAt"];
  if (!validColumns.includes(sortBy)) {
    return res.status(400).json({ error: "Invalid column to sort by" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const baseQuery = `SELECT * FROM datass`;

  const query = `
    SELECT * FROM (
      ${baseQuery} ORDER BY ${sortBy} ${sortOrder} LIMIT ${offset}, ${limit}
    ) AS sorted_data
    ORDER BY ${sortBy} ${sortOrder}
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error sorting data:", err);
      res.status(500).json({ error: "Error sorting data" });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/search", (req, res) => {
  const { term, option, page, limit } = req.query; // Thêm page và limit vào query string

  const itemsPerPage = parseInt(limit) || 10; // Số dữ liệu trên mỗi trang, mặc định là 10
  const offset = (parseInt(page) || 1 - 1) * itemsPerPage; // Độ lệch cho mỗi trang

  let query = "";
  switch (option) {
    case "temperature":
    case "humidity":
    case "light":
      query = `
        SELECT * FROM datass
        WHERE ${option} = '${term}'
        ORDER BY createAt DESC
        LIMIT ${itemsPerPage} OFFSET ${offset}
      `;
      break;
    default:
      return res.status(400).json({ error: "Invalid option" });
  }
  console.log(query);

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error searching data:", err);
      res.status(500).json({ error: "Error searching data" });
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
