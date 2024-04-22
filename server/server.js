const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
// const swaggerjsdoc = require("swagger-jsdoc");
// const swaggerui = require("swagger-ui-express");

const actionHistoryRouter = require("./routes/actionHistoryRouter.jsx");
const getDataChart = require("./routes/getDataChart.jsx");
const getDataSensor = require("./routes/getDataSs.jsx");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/get-data-sensor", getDataSensor);
app.use("/get-data-chart", getDataChart);
app.use("/get-action-history", actionHistoryRouter);

app.listen(5000, () => {
  console.log("listening on port 5000");
});
