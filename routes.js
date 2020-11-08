const express = require("express");
const router = express.Router();
const dataParser = require("./dataParser");
const api = require("./api");

router.get("/ontario/phu", async (req, res) => {
  const { query } = req;
  let options = {};
  let result = {};

  Object.keys(query).forEach((param) => {
    if (query[param] !== "all") {
      switch (param) {
        case "gender":
          options.Client_Gender = query[param];
          break;
        case "outcome":
          options.Outcome1 = query[param];
          break;
        case "age":
          options.Age_Group = query[param];
      }
    }
  });

  if (Object.values(options).length === 0) {
    result = await api.getAllData();
  } else {
    result = await api.getOptionsData(options);
  }

  const parsedData = dataParser(result.data);
  res.send(parsedData);
});

module.exports = router;
