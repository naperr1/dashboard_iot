const mqtt = require("mqtt");
const mysql = require("mysql");

// MQTT Broker settings
const mqttBroker = "mqtt://10.21.32.225:2000";
const mqttOptions = {
  username: "admin",
  password: "123456",
};
const mqttTopic = "data";

// MySQL Database settings
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "iot",
};

// Connect to MySQL
const connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Connect to MQTT broker
const client = mqtt.connect(mqttBroker, mqttOptions);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(mqttTopic);
});

client.on("message", (topic, message) => {
  if (topic === mqttTopic) {
    // Xử lý dữ liệu từ topic "data"
    const data = JSON.parse(message);
    const { temperature, humidity, light_intensity } = data;

    const query =
      "INSERT INTO datass (id, temperature, humidity, light, createAt) VALUES (NULL, ?, ?, ?, NOW())";

    const values = [temperature, humidity, light_intensity];

    connection.query(query, values, (error, results, fields) => {
      if (error) {
        console.error("Error inserting data into MySQL: ", error);
      } else {
        console.log("Data inserted into MySQL");
      }
    });
  } else if (topic === "device/ledD6" || topic === "device/ledD7") {
    // Xử lý lệnh điều khiển từ MQTT broker
    const device = topic === "device/ledD6" ? "ledD6" : "ledD7";
    const status = message.toString(); // Chuyển đổi dữ liệu nhận được thành chuỗi

    // Thực hiện cập nhật trạng thái của thiết bị vào cơ sở dữ liệu
    const updateQuery = "UPDATE devices SET status = ? WHERE device = ?";
    const updateValues = [status, device];

    connection.query(updateQuery, updateValues, (error, results, fields) => {
      if (error) {
        console.error("Error updating device status in MySQL: ", error);
      } else {
        console.log("Device status updated in MySQL");
      }
    });
  }
});

// Handle errors

client.on("error", (err) => {
  console.error("MQTT error:", err);
});

connection.on("error", (err) => {
  console.error("MySQL error:", err);
});
