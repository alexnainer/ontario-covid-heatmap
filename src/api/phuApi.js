import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1.0/ontario/phu`;

const phuApi = {
  getHeatMapAll() {
    return axios.get("/");
  },
};

export default phuApi;
