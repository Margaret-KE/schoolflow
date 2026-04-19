const API_BASE = "http://localhost:5000/api";

// Get token
function getToken() {
    return localStorage.getItem("token");
}

// Generic request function
async function apiRequest(endpoint, method = "GET", data = null) {
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

    const response = await fetch(API_BASE + endpoint, options);
    return response.json();
}