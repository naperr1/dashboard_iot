const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const moment = require("moment");

// MQTT
const mqtt = require("mqtt");
const mqttBroker = "mqtt://192.168.226.107:2000";
const mqttOptions = {
  username: "admin",
  password: "123456",
};
const client = mqtt.connect(mqttBroker, mqttOptions);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "iot",
});

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const query = `SELECT * FROM actionhistory LIMIT ${perPage} OFFSET ${offset}`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Internal Server Error: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

router.get("/sort", (req, res) => {
  const { sortBy } = req.query;
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const query = `
    SELECT * FROM actionhistory 
    ORDER BY ${sortBy} 
    LIMIT ${perPage} OFFSET ${offset}
  `;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Lỗi truy vấn:", error);
      res.status(500).send("Lỗi server");
      return;
    }
    res.json(results); // Trả về kết quả dưới dạng JSON
  });
});

// router.get("/search", (req, res) => {
//   const { searchTerm, selectedOption } = req.query; // Lấy thông tin từ query string của yêu cầu
//   const page = parseInt(req.query.page) || 1; // Trang được yêu cầu, mặc định là trang 1
//   const perPage = 10; // Số lượng bản ghi mỗi trang
//   const offset = (page - 1) * perPage; // Vị trí bắt đầu của bản ghi trong truy vấn

//   // Xây dựng truy vấn SQL để tìm kiếm dữ liệu và giữ nguyên phân trang
//   const query = `
//     SELECT * FROM actionhistory
//     WHERE ${selectedOption} LIKE '%${searchTerm}%'
//     LIMIT ${perPage} OFFSET ${offset}
//   `;

//   db.query(query, (error, results, fields) => {
//     if (error) {
//       console.error("Lỗi truy vấn:", error);
//       res.status(500).send("Lỗi server");
//       return;
//     }
//     res.json(results); // Trả về kết quả dưới dạng JSON
//   });
// });

router.get("/search", (req, res) => {
  const { searchTerm, selectedOption } = req.query;
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const offset = (page - 1) * perPage;

  if (!searchTerm || !selectedOption) {
    return res
      .status(400)
      .send("searchTerm and selectedOption query parameters are required");
  }

  // Kiểm tra selectedOption có hợp lệ không để tránh SQL Injection
  const allowedOptions = ["date", "device", "status", "ledId", "all"];
  if (!allowedOptions.includes(selectedOption)) {
    return res.status(400).send("Invalid selectedOption");
  }

  // Xây dựng truy vấn SQL
  let query;
  let queryParams = [];

  if (selectedOption === "all") {
    query = `
            SELECT * FROM actionhistory
            WHERE date LIKE ? OR device LIKE ? OR status LIKE ? OR ledId LIKE ?
            LIMIT ? OFFSET ?
        `;
    const searchPattern = `%${searchTerm}%`;
    queryParams = [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      perPage,
      offset,
    ];
  } else {
    query = `
            SELECT * FROM actionhistory
            WHERE ?? LIKE ?
            LIMIT ? OFFSET ?
        `;
    queryParams = [selectedOption, `%${searchTerm}%`, perPage, offset];
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("Lỗi truy vấn:", error);
      res.status(500).send("Lỗi server");
      return;
    }
    res.json(results);
  });
});

// router.post("/toggle-device", (req, res) => {
//   const { status, device } = req.body;

//   const id = uuidv4();

//   // Lưu trạng thái của thiết bị vào cơ sở dữ liệu
//   const currentDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Lấy ngày và giờ hiện tại
//   const insertQuery = `INSERT INTO actionhistory (id, device, status, date, ledId) VALUES (?, ?, ?, ?, ?)`;
//   db.query(
//     insertQuery,
//     [id, device, status, currentDate, device],
//     (error, results, fields) => {
//       if (error) {
//         console.error("Error inserting data into MySQL:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//         return;
//       }
//       console.log("Data inserted into MySQL successfully");
//       res.json({
//         message:
//           "Toggle request received and data inserted into MySQL successfully.",
//       });
//     }
//   );
// });

// router.post("/toggle-device", (req, res) => {
//   const { status, device } = req.body;

//   const id = uuidv4();

//   // Lưu trạng thái của thiết bị vào cơ sở dữ liệu
//   const currentDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Lấy ngày và giờ hiện tại
//   const insertQuery = `INSERT INTO actionhistory (id, device, status, date, ledId) VALUES (?, ?, ?, ?, ?)`;
//   db.query(
//     insertQuery,
//     [id, device, status, currentDate, device],
//     (error, results, fields) => {
//       if (error) {
//         console.error("Error inserting data into MySQL:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//         return;
//       }
//       console.log("Data inserted into MySQL successfully");

//       // Gửi lệnh bật/tắt đến MQTT broker dựa trên thiết bị
//       const mqttTopic = device === "fan" ? "device/ledD6" : "device/ledD7";
//       const mqttMessage = status === "on" ? "on" : "off";
//       client.publish(mqttTopic, mqttMessage);

//       res.json({
//         message:
//           "Toggle request received and data inserted into MySQL successfully.",
//       });
//     }
//   );
// });

router.post("/toggle-device", (req, res) => {
  const { status, device } = req.body;
  console.log(device);

  const id = uuidv4();

  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const insertQuery = `INSERT INTO actionhistory (id, device, status, date, ledId) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    insertQuery,
    [
      id,
      device,
      status,
      currentDate,
      device === "Fan" ? "device/ledD6" : "device/ledD7",
    ],
    (error, results, fields) => {
      if (error) {
        console.error("Error inserting data into MySQL:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      console.log("Data inserted into MySQL successfully");
      const mqttTopic = device === "Fan" ? "device/ledD6" : "device/ledD7";

      const mqttMessage = status === "on" ? "on" : "off";
      client.publish(mqttTopic, mqttMessage);

      res.json({
        message:
          "Toggle request received and data inserted into MySQL successfully.",
      });
    }
  );
});

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
    SELECT * FROM actionhistory
    WHERE date BETWEEN ? AND ?
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

router.get("/api/device_status", async (req, res) => {
  try {
    const query = `
      SELECT a.device, a.status, a.date
      FROM actionhistory a
      INNER JOIN (
        SELECT device, MAX(date) AS max_date
        FROM actionhistory
        GROUP BY device
      ) b ON a.device = b.device AND a.date = b.max_date
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }

      const results = {};
      for (let row of rows) {
        results[row.device] = row.status;
      }

      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
