import axios from 'axios';

const instance = axios.create({
    // Make sure this matches your Laravel server URL
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor to automatically add the token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle expired tokens (401 errors)
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            // Optional: redirect to login if token is invalid
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default instance;