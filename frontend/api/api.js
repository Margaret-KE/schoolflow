// ===============================
// CORE API LAYER (FINAL SAAS VERSION)
// ===============================

const API_BASE = "http://localhost:5000/api";

// ===============================
// GET TOKEN
// ===============================
function getToken() {
    return localStorage.getItem("token");
}

// ===============================
// GLOBAL API REQUEST HANDLER
// ===============================
async function apiRequest(endpoint, method = "GET", data = null) {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const res = await fetch(API_BASE + endpoint, options);

        let result;
        try {
            result = await res.json();
        } catch {
            throw new Error("Invalid server response");
        }

        // ===============================
        // AUTH ERROR HANDLING
        // ===============================
        if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "../auth/login.html";
            return;
        }

        // ===============================
        // ERROR HANDLING
        // ===============================
        if (!res.ok) {
            throw new Error(result.message || result.error || "Request failed");
        }

        return result;

    } catch (error) {
        console.error("API ERROR:", error.message);
        alert(error.message);
        return null;
    }
}

// ===============================
// OPTIONAL HELPERS (SAAS SAFE)
// ===============================
function setAuth(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}