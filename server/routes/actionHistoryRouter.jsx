const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

// MQTT
const mqtt = require("mqtt");
const mqttBroker = "mqtt://10.21.32.225:2000";
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
  const { sortBy } = req.query; // Lấy tham số sortBy từ query string của yêu cầu
  const page = parseInt(req.query.page) || 1; // Trang được yêu cầu, mặc định là trang 1
  const perPage = 10; // Số lượng bản ghi mỗi trang
  const offset = (page - 1) * perPage; // Vị trí bắt đầu của bản ghi trong truy vấn

  // Xây dựng truy vấn SQL để sắp xếp dữ liệu và giữ nguyên phân trang
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

router.get("/search", (req, res) => {
  const { searchTerm, selectedOption } = req.query; // Lấy thông tin từ query string của yêu cầu
  const page = parseInt(req.query.page) || 1; // Trang được yêu cầu, mặc định là trang 1
  const perPage = 10; // Số lượng bản ghi mỗi trang
  const offset = (page - 1) * perPage; // Vị trí bắt đầu của bản ghi trong truy vấn

  // Xây dựng truy vấn SQL để tìm kiếm dữ liệu và giữ nguyên phân trang
  const query = `
    SELECT * FROM actionhistory 
    WHERE ${selectedOption} LIKE '%${searchTerm}%' 
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

  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Lấy ngày và giờ hiện tại
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

module.exports = router;
