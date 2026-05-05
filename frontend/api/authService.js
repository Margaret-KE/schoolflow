import API, { setAuthToken } from "./auth";

// ===============================
// AUTH SERVICE (SAAS SESSION HANDLING)
// ===============================
export const loginUser = async(data) => {
    const res = await API.post("/auth/login", data);

    const accessToken =
        res &&
        res.data &&
        res.data.accessToken ?
        res.data.accessToken :
        null;

    if (accessToken) {
        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);
    }

    return res.data;
};

export const registerSchool = async(data) => {
    const res = await API.post("/auth/register", data);

    const accessToken =
        res &&
        res.data &&
        res.data.accessToken ?
        res.data.accessToken :
        null;

    if (accessToken) {
        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);
    }

    return res.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
};

export const loadToken = () => {
    const token = localStorage.getItem("token");

    if (token) {
        setAuthToken(token);
    }

    return token;
};