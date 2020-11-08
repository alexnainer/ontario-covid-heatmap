const axios = require("axios");

const ontarioApi = "https://data.ontario.ca/api/3/action/datastore_search";
const resourceId = "455fd63b-603d-4608-8216-7d8647f43350";

const limit = 90000;

const getAllData = () => {
  return axios.get(`${ontarioApi}?resource_id=${resourceId}&limit=${limit}`);
};

const getOptionsData = (options) => {
  return axios.get(
    `${ontarioApi}?resource_id=${resourceId}&limit=${limit}&filters=${JSON.stringify(
      options
    )}`
  );
};

module.exports = {
  getAllData,
  getOptionsData,
};
