// ===============================
// DASHBOARD API (FINAL SAAS MULTI-SCHOOL)
// ===============================

import API from "./auth";

// ===============================
// SUBSCRIPTION CHECK (FRONTEND EXAMPLE)
// ===============================
const res = await fetch("http://localhost:5000/api/subscriptions", {
    headers: { Authorization: "Bearer " + token }
});

const sub = await res.json();

if (sub.status !== "active") {
    window.location.href = "../admin/subscription.html";
}

// ===============================
// MAIN DASHBOARD STATS
// ===============================
export const getDashboardStats = () =>
    API.get("/dashboards");

// ===============================
// ROLE-BASED DASHBOARD (FUTURE READY)
// ===============================
export const getRoleDashboard = () =>
    API.get("/dashboards/role");

// ===============================
// LIVE DASHBOARD (REAL-TIME READY)
// ===============================
export const getDashboardLive = () =>
    API.get("/dashboards/live");

// ===============================
// ANALYTICS DATA (CHARTS / REPORTS)
// ===============================
export const getDashboardAnalytics = () =>
    API.get("/dashboards/analytics");
() =>
API.get("/dashboards/analytics");