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

  const validColumns = [
    "id",
    "temperature",
    "humidity",
    "light",
    "wind_speed",
    "createAt",
  ];
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
// router.get("/search", (req, res) => {
//   const { term, option, page, limit } = req.query;

//   const itemsPerPage = parseInt(limit) || 10;
//   const offset = (parseInt(page) || 1 - 1) * itemsPerPage;

//   // Chuyển đổi biến term sang kiểu số thực
//   const termFloat = parseFloat(term);

//   // Kiểm tra xem liệu term có phải là một số hợp lệ không
//   if (isNaN(termFloat) && option !== "date") {
//     return res.status(400).json({ error: "Invalid term" });
//   }

//   let query = "";
//   switch (option) {
//     case "temperature":
//     case "humidity":
//     case "light":
//       query = `
//                 SELECT * FROM datass
//                 WHERE ${option} = ?
//                 ORDER BY createAt DESC
//                 LIMIT ?, ?
//             `;
//       db.query(query, [termFloat, offset, itemsPerPage], (err, results) => {
//         if (err) {
//           handleQueryError(res, err, "Error searching data");
//         } else {
//           res.status(200).json(results);
//         }
//       });
//       break;
//     case "date":
//       // Kiểm tra xem term có đúng định dạng thời gian không
//       if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(term)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid time format. Please use HH:mm:ss" });
//       }
//       query = `
//             SELECT * FROM datass
//             WHERE TIME(createAt) = ?
//             ORDER BY createAt DESC
//             LIMIT ?, ?
//         `;
//       db.query(query, [term, offset, itemsPerPage], (err, results) => {
//         if (err) {
//           handleQueryError(res, err, "Error searching data");
//         } else {
//           res.status(200).json(results);
//         }
//       });
//       break;
//     case "date":
//       // Kiểm tra xem term có đúng định dạng thời gian không
//       if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(term)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid time format. Please use HH:mm:ss" });
//       }
//       query = `
//                 SELECT * FROM datass
//                 WHERE TIME(createAt) = ?
//                 ORDER BY createAt DESC
//                 LIMIT ?, ?
//             `;
//       db.query(query, [term, offset, itemsPerPage], (err, results) => {
//         if (err) {
//           return res.status(500).json({ error: "Error searching data" });
//         } else {
//           res.status(200).json(results);
//         }
//       });
//       break;

//     default:
//       return res.status(400).json({ error: "Invalid option" });
//   }
// });

// router.get("/search", (req, res) => {
//   const { term, option, page, limit } = req.query;

//   const itemsPerPage = parseInt(limit) || 10;
//   const offset = (parseInt(page) - 1 || 0) * itemsPerPage;

//   const termFloat = parseFloat(term);

//   if (option !== "all" && isNaN(termFloat) && option !== "date") {
//     return res.status(400).json({ error: "Invalid term" });
//   }

//   let query = "";
//   let queryParams = [];

//   switch (option) {
//     case "temperature":
//     case "humidity":
//     case "light":
//       query = `
//         SELECT * FROM datass
//         WHERE ${option} = ?
//         ORDER BY createAt DESC
//         LIMIT ?, ?
//       `;
//       queryParams = [termFloat, offset, itemsPerPage];
//       break;

//     case "date":
//       // Kiểm tra định dạng thời gian của term
//       if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(term)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid time format. Please use HH:mm:ss" });
//       }
//       query = `
//         SELECT * FROM datass
//         WHERE TIME(createAt) = ?
//         ORDER BY createAt DESC
//         LIMIT ?, ?
//       `;
//       queryParams = [term, offset, itemsPerPage];
//       break;

//     case "all":
//       query = `
//         SELECT * FROM datass
//         WHERE temperature = ? OR humidity = ? OR light = ?
//         ORDER BY createAt DESC
//         LIMIT ?, ?
//       `;
//       // Lặp qua giá trị của term để thêm vào mảng queryParams
//       queryParams = [termFloat, termFloat, termFloat, offset, itemsPerPage];
//       break;

//     default:
//       return res.status(400).json({ error: "Invalid option" });
//   }

//   db.query(query, queryParams, (err, results) => {
//     if (err) {
//       handleQueryError(res, err, "Error searching data");
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

router.get("/search", (req, res) => {
  const { term, option, page, limit } = req.query;

  const itemsPerPage = parseInt(limit) || 10;
  const offset = (parseInt(page) - 1 || 0) * itemsPerPage;

  const termFloat = parseFloat(term);

  if (option !== "all" && isNaN(termFloat) && option !== "date") {
    return res.status(400).json({ error: "Invalid term" });
  }

  let query = "";
  let queryParams = [];

  switch (option) {
    case "temperature":
    case "humidity":
    case "light":
    case "wind":
      const column = option === "wind" ? "wind_speed" : option;
      query = `
        SELECT * FROM datass
        WHERE ${column} = ?
        ORDER BY createAt DESC
        LIMIT ?, ?
      `;
      queryParams = [termFloat, offset, itemsPerPage];
      break;

    case "date":
      if (!/^\d{2}:\d{2}:\d{2} \d{1,2}\/\d{1,2}\/\d{4}$/.test(term)) {
        return res.status(400).json({
          error: "Invalid datetime format. Please use HH:mm:ss dd/MM/yyyy",
        });
      }

      // Chuyển đổi term thành định dạng mà MySQL có thể hiểu được
      const [time, date] = term.split(" ");
      const [day, month, year] = date.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )} ${time}`;

      query = `
    SELECT * FROM datass
    WHERE createAt = ?
    ORDER BY createAt DESC
    LIMIT ?, ?
  `;
      queryParams = [formattedDate, offset, itemsPerPage];
      break;

    case "all":
      query = `
        SELECT * FROM datass
        WHERE temperature = ? OR humidity = ? OR light = ? OR wind_speed = ?
        ORDER BY createAt DESC
        LIMIT ?, ?
      `;
      queryParams = [
        termFloat,
        termFloat,
        termFloat,
        termFloat,
        offset,
        itemsPerPage,
      ];
      break;

    default:
      return res.status(400).json({ error: "Invalid option" });
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      handleQueryError(res, err, "Error searching data");
    } else {
      res.status(200).json(results);
    }
  });
});

// more ...

module.exports = router;
