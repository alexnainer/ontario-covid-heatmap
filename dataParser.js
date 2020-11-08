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
  const geoJson = Object.values(cities).map(city => city.geoJson);
  console.log("cities", geoJson);
};

const dataParserSchools = async () => {
  // change below call
  const { data } = await api.getAllData();

  const schools = {};

  data.result.records.forEach((record) => {
    const schoolName = record.school;
    if (schools[school]) {
      if (record.total_confirmed_cases > schools[school].geoJson.properties.caseNum) {
        schools[school].geoJson.properties.caseNum = record.total_confirmed_cases;
      }
      
    } else {
      schools[schoolName] = {
        geoJson: {
          type: "feature",
          geometry:{
            type:"Point",
            coordinates : []
          },
          properties : {
              id: schoolName,
              caseNum: record.total_confirmed_cases
          }
        }
      };
    }
  })
}


// const dataParserLtc = async () => {
//   // change below call
//   const { data } = await api.getAllData();

//   const longCareHomes = {};

//   data.result.records.forEach((record) => {
//     const longCareHome = record.LTC_Home;
//     if (longCareHomes[longCareHome])
//   })


module.exports = dataParser;
