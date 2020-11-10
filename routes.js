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
          break;
        case "cause":
          options.Case_AcquisitionInfo = query[param];
      }
    }
  });

  if (Object.values(options).length === 0) {
    result = await api.getAllPhuData();
  } else {
    result = await api.getOptionsPhuData(options);
  }

  const parsedData = dataParser.parsePhu(result.data);
  res.send(parsedData);
});

router.get("/ontario/schools", async (req, res) => {
  const result = await api.getSchoolData();

  const parsedData = await dataParser.parseSchools(result.data);
  res.send(parsedData);
});

router.get("/ontario/ltr", async (req, res) => {
  const result = await api.getLtrData();

  const parsedData = await dataParser.parseLtr(result.data);
  res.send(parsedData);
});

router.get("/ontario/childCare", async (req, res) => {
  const result = await api.getChildCareData();

  const parsedData = await dataParser.parseChildCare(result.data);
  res.send(parsedData);
});

module.exports = router;
