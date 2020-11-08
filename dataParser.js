const dataParser = (data) => {
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
    } if (cities[phuCity].geoJson.properties.caseNum > max) {
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
  console.log("cities" + cities);
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

const dataParserSchools = async () => {
  // change below call
  const { data } = await api.getAllData();

  const schools = {};

  data.result.records.forEach((record) => {
    const schoolName = record.school;
    if (schools[school]) {
      if (
        record.total_confirmed_cases >
        schools[school].geoJson.properties.caseNum
      ) {
        schools[school].geoJson.properties.caseNum =
          record.total_confirmed_cases;
      }
    } else {
      schools[schoolName] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: [],
          },
          properties: {
            id: schoolName,
            caseNum: record.total_confirmed_cases,
          },
        },
      };
    }
  });
};

// const dataParserLtc = async () => {
//   // change below call
//   const { data } = await api.getAllData();

//   const longCareHomes = {};

//   data.result.records.forEach((record) => {
//     const longCareHome = record.LTC_Home;
//     if (longCareHomes[longCareHome])
//   })

module.exports = dataParser;
