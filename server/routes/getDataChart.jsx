const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "iot",
});

router.get("/", (req, res) => {
  const query =
    "SELECT id, temperature, humidity, light FROM datass ORDER BY id DESC LIMIT 10";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error querying data from MySQL:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const reversedResults = results.reverse();

    res.json(reversedResults);
  });
});

module.exports = router;
