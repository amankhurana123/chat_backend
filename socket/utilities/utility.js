import axios from "axios";
export const apiInstance = options => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8081",
    withCredentials: false,
    timeout: 1000 * 5
  });
  return axiosInstance(options);
};
