import axios from 'axios';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/useAppStore';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// Interceptor to handle global errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios Interceptor Error:", error);
        const { response } = error;
        if (response) {
            console.error("Error Response Data:", response.data);
            switch (response.status) {
                case 401:
                    console.warn("401 Unauthorized detected. Logging out...");
                    // Clear auth state and redirect to login
                    useAppStore.getState().logout();
                    window.location.href = '/login';
                    break;
                case 422:
                    // Return the error object for form validation
                    return Promise.reject(error);
                case 500:
                    // Show a generic server error toast
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;