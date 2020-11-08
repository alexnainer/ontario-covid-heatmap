const api = require("./api");
const coordinates = require("./coordinates.json");

const parsePhu = (data) => {
  let cities = {};
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  data.result.records.forEach((record) => {
    const phuCity = record.Reporting_PHU_City;

    if (cities[phuCity]) {
      cities[phuCity].geoJson.properties.caseNum++;
    } else {
      cities[phuCity] = {
        geoJson: {
          type: "Feature",
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
            caseNumNormalized: 1,
          },
        },
      };
    }
    if (cities[phuCity].geoJson.properties.caseNum < min) {
      min = cities[phuCity].geoJson.properties.caseNum;
    }
    if (cities[phuCity].geoJson.properties.caseNum > max) {
      max = cities[phuCity].geoJson.properties.caseNum;
    }
  });

  cities = Object.values(cities).map((city) => {
    return {
      geoJson: {
        ...city.geoJson,
        properties: {
          ...city.geoJson.properties,
          caseNumNormalized:
            (city.geoJson.properties.caseNum - min) / (max - min),
        },
      },
    };
  });
  const geoJson = Object.values(cities).map((city) => city.geoJson);
  return {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: geoJson,
  };
};

const parseSchools = async (data) => {
  const schools = {};
  //   const coordinates = {};
  let cities = {};
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  for (record of data.result.records) {
    const schoolName = record.school;
    if (schools[schoolName]) {
      if (record.total_confirmed_cases > schools[schoolName].caseNum) {
        schools[schoolName].caseNum = record.total_confirmed_cases;
      }
    } else {
      schools[schoolName] = {
        city: record.municipality,
        caseNum: record.total_confirmed_cases,
      };
    }
  }

  for (school of Object.keys(schools)) {
    const city = schools[school].city;
    if (cities[city]) {
      cities[city].geoJson.properties.caseNum += schools[school].caseNum;
      cities[city].geoJson.properties.schoolNames.push(school);
    } else {
      //   const query = `${city} Ontario`;
      //   const { data } = await api.getGeocoding(query);
      //   coordinates[city] = {
      //     coordinates: coordinates[city].coordinates,
      //   };
      cities[city] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: coordinates[city].coordinates,
          },
          properties: {
            id: city,
            city,
            caseNum: schools[school].caseNum,
            schoolNames: [school],
          },
        },
      };
    }
    if (cities[city].geoJson.properties.caseNum < min) {
      min = cities[city].geoJson.properties.caseNum;
    }
    if (cities[city].geoJson.properties.caseNum > max) {
      max = cities[city].geoJson.properties.caseNum;
    }
  }

  console.log("coordinates", coordinates);

  cities = Object.values(cities).map((city) => {
    return {
      geoJson: {
        ...city.geoJson,
        properties: {
          ...city.geoJson.properties,
          caseNumNormalized:
            (city.geoJson.properties.caseNum - min) / (max - min),
        },
      },
    };
  });

  const geoJson = Object.values(cities).map((city) => city.geoJson);

  console.log("geoJson", geoJson);
  return {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: geoJson,
  };
};

// const dataParserLtc = async () => {
//   // change below call
//   const { data } = await api.getAllData();

//   const longCareHomes = {};

//   data.result.records.forEach((record) => {
//     const longCareHome = record.LTC_Home;
//     if (longCareHomes[longCareHome])
//   })

module.exports = { parsePhu, parseSchools };
