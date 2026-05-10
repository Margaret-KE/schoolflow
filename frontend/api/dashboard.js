// ===============================
// DASHBOARD API (FINAL - SYNCED WITH BACKEND)
// ===============================

import API from "./auth";

// ===============================
// SUBSCRIPTION CHECK
// ===============================
export const checkSubscription = async() => {
    try {
        const res = await API.get("/subscriptions");

        if (res.data.status !== "active") {
            window.location.href = "../admin/subscription.html";
        }

        return res.data;
    } catch (err) {
        console.error("Subscription check failed:", err);
        throw err;
    }
};

// ===============================
// MAIN DASHBOARD STATS
// ===============================
export const getDashboardStats = async() => {
    const res = await API.get("/dashboards");
    return res.data.data;
};

// ===============================
// ANALYTICS (CHART DATA)
// ===============================
export const getDashboardAnalytics = async() => {
    const res = await API.get("/dashboards/analytics");
    return res.data.data;
};

// ===============================
// ROLE-BASED DASHBOARD
// ===============================
export const getRoleDashboard = async() => {
    const res = await API.get("/dashboards/role");
    return res.data.data;
};

// ===============================
// LIVE DASHBOARD (OPTIONAL FUTURE)
// ===============================
export const getDashboardLive = async() => {
    const res = await API.get("/dashboards/live");
    return res.data.data;
};