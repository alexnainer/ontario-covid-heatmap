const api = require("./api");
const coordinates = require("./coordinates.json");
const coordinatesLtr = require("./coordinatesLtr.json");
const coordinatesChildCare = require("./coordinatesChildCare.json");
// const fs = require("fs");

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
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
        totalCases: data.result.records.length,
      },
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
  let totalCases = 0;

  for (record of data.result.records) {
    const schoolName = record.school;
    if (schools[schoolName]) {
      if (record.total_confirmed_cases > schools[schoolName].caseNum) {
        schools[schoolName].caseNum = record.total_confirmed_cases;
      }
    } else {
      schools[schoolName] = {
        city: record.municipality.trim(),
        caseNum: record.total_confirmed_cases,
      };
    }
  }

  for (school of Object.keys(schools)) {
    const city = schools[school].city;
    if (cities[city]) {
      cities[city].geoJson.properties.caseNum += schools[school].caseNum;
      totalCases += schools[school].caseNum;
      cities[
        city
      ].geoJson.properties.schoolNames += `,${school} (${schools[school].caseNum})`;
    } else {
      let coords = [];
      if (coordinates[city]) {
        coords = coordinates[city].coordinates;
      } else {
        console.log(city);
        const query = `${city} Ontario`;
        const { data } = await api.getGeocoding(query);
        coords = data.features[0].geometry.coordinates;
        // coordinates[city] = {
        //   coordinates: coordinates[city].coordinates,
        // };
      }
      //   const query = `${city} Ontario`;
      //   const { data } = await api.getGeocoding(query);
      //   coords = data.features[0].geometry.coordinates;
      //   coordinates[city] = { coordinates: coords };

      totalCases += schools[school].caseNum;
      cities[city] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
          properties: {
            id: city,
            city,
            caseNum: schools[school].caseNum,
            schoolNames: `${school} (${schools[school].caseNum})`,
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

  //   console.log("coordinates", coordinates);

  //   fs.writeFile("coordinates.json", JSON.stringify(coordinates), (err) => {
  //     // throws an error, you could also catch it here
  //     if (err) throw err;

  //     // success case, the file was saved
  //     console.log("File saved!");
  //   });

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
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
        totalCases,
      },
    },
    features: geoJson,
  };
};

const parseLtr = async (data) => {
  const ltrs = {};
  //   const coordinatesLtr = {};
  let cities = {};
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;
  let totalCases = 0;

  for (record of data.result.records) {
    const ltrName = record.LTC_Home;
    if (record.Total_LTC_HCW_Cases.substring(0, 1) === "<") {
      record.Total_LTC_HCW_Cases = parseInt(
        record.Total_LTC_HCW_Cases.substring(1)
      );
    } else {
      record.Total_LTC_HCW_Cases = parseInt(record.Total_LTC_HCW_Cases);
    }

    if (record.Total_LTC_Resident_Cases.substring(0, 1) === "<") {
      record.Total_LTC_Resident_Cases = parseInt(
        record.Total_LTC_Resident_Cases.substring(1)
      );
    } else {
      record.Total_LTC_Resident_Cases = parseInt(
        record.Total_LTC_Resident_Cases
      );
    }

    const totalCases =
      record.Total_LTC_Resident_Cases + record.Total_LTC_HCW_Cases;
    if (ltrs[ltrName]) {
      if (totalCases > ltrs[ltrName].caseNum) {
        ltrs[ltrName].caseNum = totalCases;
      }
    } else {
      ltrs[ltrName] = {
        city: record.City.trim(),
        caseNum: totalCases,
      };
    }
  }

  for (ltr of Object.keys(ltrs)) {
    const city = ltrs[ltr].city;
    if (cities[city]) {
      cities[city].geoJson.properties.caseNum += ltrs[ltr].caseNum;
      cities[
        city
      ].geoJson.properties.schoolNames += `,${ltr} (${ltrs[ltr].caseNum})`;
      totalCases += ltrs[ltr].caseNum;
    } else {
      let coords = [];
      if (coordinatesLtr[city]) {
        coords = coordinatesLtr[city].coordinates;
      } else {
        console.log(city);
        const query = `${city} Ontario`;
        const { data } = await api.getGeocoding(query);
        coords = data.features[0].geometry.coordinates;
      }

      //   const query = `${city} Ontario`;
      //   const { data } = await api.getGeocoding(query);
      //   coords = data.features[0].geometry.coordinates;
      //   coordinatesLtr[city] = { coordinates: coords };

      totalCases += ltrs[ltr].caseNum;
      cities[city] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
          properties: {
            id: city,
            city,
            caseNum: ltrs[ltr].caseNum,
            schoolNames: `${ltr} (${ltrs[ltr].caseNum})`,
            ltr,
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

  //   console.log("coordinates", coordinates1);

  //   fs.writeFile("coordinatesLtr.json", JSON.stringify(coordinatesLtr), (err) => {
  //     // throws an error, you could also catch it here
  //     if (err) throw err;

  //     // success case, the file was saved
  //     console.log("File saved!");
  //   });

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
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
        totalCases,
      },
    },
    features: geoJson,
  };
};

const parseChildCare = async (data) => {
  const childCares = {};
  const coordinates = {};
  let cities = {};
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;
  let totalCases = 0;

  for (record of data.result.records) {
    const lccName = record.lcc_name;
    if (childCares[lccName]) {
      if (record.id >= childCares[lccName].id) {
        childCares[lccName].caseNum = record.total_confirmed_cases;
      }
    } else {
      childCares[lccName] = {
        city: record.municipality.trim(),
        caseNum: record.total_confirmed_cases,
        id: record._id,
      };
    }
  }

  for (lcc of Object.keys(childCares)) {
    const city = childCares[lcc].city;
    if (cities[city]) {
      cities[city].geoJson.properties.caseNum += childCares[lcc].caseNum;
      totalCases += childCares[lcc].caseNum;
      cities[
        city
      ].geoJson.properties.childCareNames += `,${lcc} (${childCares[lcc].caseNum})`;
    } else {
      let coords = [];
      if (coordinatesChildCare[city]) {
        coords = coordinatesChildCare[city].coordinates;
      } else {
        console.log(city);
        const query = `${city} Ontario`;
        const { data } = await api.getGeocoding(query);
        coords = data.features[0].geometry.coordinates;
        coordinatesChildCare[city] = {
          coordinates: coords,
        };
      }
      totalCases += childCares[lcc].caseNum;
      cities[city] = {
        geoJson: {
          type: "feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
          properties: {
            id: city,
            city,
            caseNum: childCares[lcc].caseNum,
            childCareNames: `${lcc} (${childCares[lcc].caseNum})`,
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
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
        totalCases,
      },
    },
    features: geoJson,
  };
};

module.exports = { parsePhu, parseSchools, parseLtr, parseChildCare };
