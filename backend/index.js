const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const host = process.env.HOST;
const port = process.env.PORT;
const subdirectory = process.env.SUBDIRECTORY;

app.use(cors());
app.options("*", cors());

const router = require("./routes");
app.use(`${subdirectory}/api/v1.0`, router);

app.listen(port, () => {
  console.log(`backend listening at http://${host}:${port}`);
});
