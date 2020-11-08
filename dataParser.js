const api = require("./api");

const dataParser = async () => {
  const { data } = await api.getAllData();

  const cities = {};

  data.result.records.forEach((record) => {
    const phuCity = record.Reporting_PHU_City;
    if (cities[phuCity]) {
      cities[phuCity].geoJson.properties.caseNum++;
    } else {
      cities[phuCity] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: [
              record.Reporting_PHU_Longitude,
              record.Reporting_PHU_Latitude,
            ],
          },
          properties: {
            id: record.Reporting_PHU,
            healthUnit: record.Reporting_PHU,
            city: record.Reporting_PHU_City,
            caseNum: 1,
          },
        },
      };
    }
  });
  const geoJson = Object.values(cities);
  console.log("cities", cities);
};

module.exports = dataParser;
