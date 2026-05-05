// ===============================
// CONFIG
// ===============================
const API_BASE = "http://localhost:5000/api";

// ===============================
// TOKEN HANDLING
// ===============================
function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    if (token) {
        localStorage.setItem("token", token);
    }
}

function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

// ===============================
// REDIRECT TO LOGIN
// ===============================
function redirectToLogin() {
    clearSession();
    window.location.href = "/auth/login.html";
}

// ===============================
// GENERIC API REQUEST (FINAL)
// ===============================
async function apiRequest(endpoint, method = "GET", data = null) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_BASE + endpoint, options);

        let result = null;

        try {
            result = await response.json();
        } catch (e) {
            result = { message: "Invalid server response" };
        }

        // ===============================
        // AUTH HANDLING
        // ===============================
        if (response.status === 401) {
            alert("Session expired. Please login again.");
            redirectToLogin();
            return null;
        }

        if (response.status === 403) {
            alert("You are not allowed to perform this action.");
            return null;
        }

        // ===============================
        // ERROR HANDLING
        // ===============================
        if (!response.ok) {
            const msg =
                (result && result.message) ||
                (result && result.error) ||
                "Request failed";

            throw new Error(msg);
        }

        return result;

    } catch (error) {
        console.error("API ERROR:", error.message);

        // Network / server down
        if (error.message === "Failed to fetch") {
            alert("Server unreachable. Check your connection.");
        } else {
            alert(error.message);
        }

        return null;
    }
}

// ===============================
// HELPER METHODS (CLEAN CALLS)
// ===============================
function apiGet(endpoint) {
    return apiRequest(endpoint, "GET");
}

function apiPost(endpoint, data) {
    return apiRequest(endpoint, "POST", data);
}

function apiPut(endpoint, data) {
    return apiRequest(endpoint, "PUT", data);
}

function apiDelete(endpoint) {
    return apiRequest(endpoint, "DELETE");
}