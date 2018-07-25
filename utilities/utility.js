import axios from "axios";
// console.log("axios-----------", axios.create);
const apiInstance = options => {
  console.log("optoions------------34345-", options);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: false,
    timeout: 1000 * 10
  });

  return axiosInstance(options);
};
export { apiInstance };
