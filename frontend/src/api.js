import axios from 'axios';

const sop = axios.create({
    baseURL: "http://localhost:8000/sop",
    withCredentials: true, // Ensures cookies are sent with requests
});

// Add CSRF token to requests automatically
sop.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken(); // Retrieve CSRF token from cookies
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
});

function getCsrfToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
}

export default sop;
