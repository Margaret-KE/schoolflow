import axios from "axios";

// ===============================
// BASE API (SAAS SAFE)
// ===============================
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    timeout: 15000
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
API.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }

        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// ===============================
// RESPONSE INTERCEPTOR (SAAS SECURITY)
// ===============================
API.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        const status =
            error &&
            error.response &&
            error.response.status ?
            error.response.status :
            null;

        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/auth/login.html";
        }

        return Promise.reject(error);
    }
);

// ===============================
// AUTH API
// ===============================
export const registerSchool = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const refreshToken = (data) => API.post("/auth/refresh", data);

export const logout = function() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login.html";
};

// ===============================
// TOKEN HELPER
// ===============================
export const setAuthToken = function(token) {
    if (token) {
        API.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        delete API.defaults.headers.common["Authorization"];
    }
};

export default API;