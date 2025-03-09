import axios from 'axios';

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

export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    console.log("🔍 All Cookies:", cookies);  // Debugging

    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        console.log(`🔍 Checking Cookie: ${cookieName} = ${cookieValue}`);  // Debugging

        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}


axios.defaults.withCredentials = true;  // Include credentials in requests
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');  // Include CSRF token in headers

// Explicit function to get OneDrive token
export const getOneDriveAccessToken = () => {
    const token = getCookie('onedrive_access_token');
    console.log("🛠 OneDrive Token Retrieved:", token);  // Debugging
    return token;
};

// Attach to window for debugging in the browser console
window.getOneDriveAccessToken = getOneDriveAccessToken;
window.getCookie = function (name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};


// Base Axios instance with credentials included
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,  // Ensure cookies are always sent
});

// Attach Authorization Header for OneDrive Requests
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
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

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("🔄 Refreshing OneDrive token...");
                const refreshRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/onedrive/refresh-token/`, {}, { withCredentials: true });

                if (refreshRes.data.access_token) {
                    document.cookie = `onedrive_access_token=${refreshRes.data.access_token}; path=/;`;
                    originalRequest.headers.Authorization = `Bearer ${refreshRes.data.access_token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error("❌ OneDrive Token refresh failed", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ✅ Export axiosInstance as the default export
export default axiosInstance;
