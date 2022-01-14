const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const host = process.env.HOST;
const port = process.env.PORT;

app.use(cors());
app.options("*", cors());

const router = require("./routes");
app.use("/api/v1.0", router);

app.listen(port, () => {
  console.log(`backend listening at http://${host}:${port}`);
});
