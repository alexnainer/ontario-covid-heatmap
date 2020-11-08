import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1.0/ontario/phu`;

const phuApi = {
  getHeatMap(options) {
    let queryParams = "";
    Object.keys(options).forEach((option) => {
      queryParams += `&${option}=${options[option]}`;
    });
    queryParams = "?" + queryParams.substring(1);
    console.log("queryParams", queryParams);
    return axios.get(`${queryParams}`);
  },
};

export default phuApi;
