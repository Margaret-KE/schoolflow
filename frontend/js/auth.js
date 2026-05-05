// ===============================
// AUTH MODULE (FINAL SAAS VERSION)
// ===============================

// ===============================
// LOGIN
// ===============================
async function loginUser(email, password) {
    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return null;
        }

        if (data.accessToken || data.token) {

            const token = data.accessToken || data.token;

            // ===============================
            // SAVE SESSION (SAAS SAFE)
            // ===============================
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // ===============================
            // ROLE REDIRECT (CLEAN)
            // ===============================
            redirectByRole(data.user.role);

            return data;
        }

        alert("Invalid login response");
        return null;

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        alert("Server error. Try again.");
        return null;
    }
}

// ===============================
// ROLE REDIRECT (CENTRALIZED)
// ===============================
function redirectByRole(role) {
    if (role === "admin") {
        window.location.href = "../admin/dashboard.html";
    } else if (role === "teacher") {
        window.location.href = "../teacher/dashboard.html";
    } else if (role === "parent") {
        window.location.href = "../parent/dashboard.html";
    } else {
        window.location.href = "../index.html";
    }
}

// ===============================
// LOGOUT (GLOBAL SAFE)
// ===============================
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "../auth/login.html";
}

// ===============================
// GET CURRENT USER
// ===============================
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        return null;
    }
}

// ===============================
// GET TOKEN
// ===============================
function getToken() {
    return localStorage.getItem("token");
}

// ===============================
// CHECK AUTH STATUS
// ===============================
function isLoggedIn() {
    return !!getToken();
}