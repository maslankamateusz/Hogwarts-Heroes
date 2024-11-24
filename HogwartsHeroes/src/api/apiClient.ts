import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.potterdb.com/v1', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
