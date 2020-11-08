const express = require("express");
const router = express.Router();
const dataParser = require("./dataParser");

router.get("/ontario/phu", async (req, res) => {
  const data = await dataParser();
  res.send(data);
});

module.exports = router;
