const api = require("./api");

const dataParser = async () => {
  const { data } = await api.getAllData();

  const cities = {};

  console.log("total", data);
  //   console.log("data", data);
  data.result.records.forEach((record) => {
    const phuCity = record.Reporting_PHU_City;
    if (cities[phuCity]) {
      cities[phuCity]++;
    } else {
      cities[phuCity] = 1;
    }
  });
  console.log("cities.length", Object.keys(cities).length);
  Object.keys(cities).forEach((city) => {
    console.log(city, cities[city]);
  });
};

module.exports = dataParser;
