import axios from 'axios';
import Cookies from 'js-cookie';

export const getCSRFToken = () => {
    let csrfToken = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                csrfToken = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return csrfToken;
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;  // Include credentials in requests
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');  // Include CSRF token in headers

const csrfToken = Cookies.get('csrftoken');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
}

// Base Axios instance with credentials included
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,  // Ensure cookies are always sent
    withXSRFToken: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
});

// Automatically refresh the access token if it expires
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token is expired, try refreshing it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint (cookie-based)
                await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`, {}, { withCredentials: true });

                // Retry original request after refreshing token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;