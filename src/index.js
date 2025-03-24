import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Ghi đè baseURL cho toàn bộ ứng dụng
axios.defaults.baseURL = 'https://medical-appointment-api.onrender.com';
console.log('Set');

// Ghi lại URL API để debug
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

// Thêm interceptor cho tất cả requests
axios.interceptors.request.use(
    config => {
        console.log('Axios request:', {
            url: config.url,
            baseURL: config.baseURL,
            method: config.method,
            data: config.data
        });
        return config;
    },
    error => {
        console.error('Axios request error:', error);
        return Promise.reject(error);
    }
);

// Thêm interceptor cho tất cả responses
axios.interceptors.response.use(
    response => {
        console.log('Axios response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Axios response error:', error.response || error);
        return Promise.reject(error);
    }
);

// Để không có sử dụng strict mode tạm thời
ReactDOM.render(
  <App />,
  document.getElementById('root')
); 