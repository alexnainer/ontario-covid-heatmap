import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1.0/ontario`;

const api = {
  getPhuHeatMap(options) {
    let queryParams = "";
    Object.keys(options).forEach((option) => {
      queryParams += `&${option}=${options[option]}`;
    });
    queryParams = "?" + queryParams.substring(1);
    console.log("queryParams", queryParams);
    return axios.get(`/phu${queryParams}`);
  },

  getSchoolHeatMap() {
    return axios.get(`/schools`);
  },

  getLtrHeatMap() {
    return axios.get(`/ltr`);
  },

  getChildCareHeatMap() {
    return axios.get('/childCare');
  },
  
};

export default api;
