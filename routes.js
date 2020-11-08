const express = require("express");
const router = express.Router();
const dataParser = require("./dataParser");

router.get("/ontario", async (req, res) => {
  await dataParser();
  res.send("Men!");
});

module.exports = router;
