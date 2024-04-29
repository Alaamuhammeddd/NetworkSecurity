import axios from "axios";

// Retrieve the token from local storage
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
