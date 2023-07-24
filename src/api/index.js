import axios from 'axios';

const getToken = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  return token;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: "https://datatera.herokuapp.com/api/v1",
  // baseURL: "http://127.0.0.1:5000/api/v1",
  // baseURL: "http://100.26.50.138:5000/api/v1",
});

console.log('getToken', getToken);

api.interceptors.request.use(
  async (config) => {
    config.headers.authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return error;
  },
);

export default api;
