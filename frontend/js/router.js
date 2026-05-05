// ===============================
// SIMPLE SPA ROUTER (FINAL)
// ===============================

// ROUTES MAP
const routes = {
    "/": "/admin/dashboard.html",
    "/dashboard": "/admin/dashboard.html",
    "/students": "/admin/students.html",
    "/attendance": "/admin/attendance.html",
    "/payments": "/admin/payments.html",
    "/results": "/admin/results.html"
};

// ===============================
// GET TOKEN & USER
// ===============================
function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        return null;
    }
}

// ===============================
// AUTH GUARD
// ===============================
function isAuthenticated() {
    return !!getToken();
}

// ===============================
// ROLE GUARD
// ===============================
function getDefaultRouteByRole(role) {
    if (role === "admin") return "/dashboard";
    if (role === "teacher") return "/attendance";
    if (role === "parent") return "/students";
    return "/dashboard";
}

// ===============================
// LOAD VIEW
// ===============================
async function loadView(path) {
    const app = document.getElementById("app");

    if (!app) return;

    const route = routes[path] || routes["/"];

    try {
        const res = await fetch(route);
        const html = await res.text();

        app.innerHTML = html;

        // Execute inline scripts safely
        const scripts = app.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.text = oldScript.text;
            document.body.appendChild(newScript);
            oldScript.remove();
        });

    } catch (error) {
        console.error("ROUTER ERROR:", error.message);
        app.innerHTML = "<h2>Page failed to load</h2>";
    }
}

// ===============================
// NAVIGATE
// ===============================
function navigate(path) {
    window.history.pushState({}, "", path);
    handleRoute();
}

// ===============================
// ROUTE HANDLER
// ===============================
function handleRoute() {
    const path = window.location.pathname;

    // AUTH CHECK
    if (!isAuthenticated()) {
        window.location.href = "/auth/login.html";
        return;
    }

    const user = getUser();

    // ROLE BASE REDIRECT (if root)
    if (path === "/" || path === "") {
        const redirectPath = getDefaultRouteByRole(user && user.role);
        navigate(redirectPath);
        return;
    }

    loadView(path);
}

// ===============================
// BACK/FORWARD SUPPORT
// ===============================
window.addEventListener("popstate", handleRoute);

// ===============================
// INIT ROUTER
// ===============================
function initRouter() {
    handleRoute();
}

// AUTO START
document.addEventListener("DOMContentLoaded", initRouter);