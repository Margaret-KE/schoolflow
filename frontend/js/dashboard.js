// ===============================
// DASHBOARD MODULE (FINAL SAAS VERSION)
// ===============================

// ===============================
// AUTH GUARD
// ===============================
if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
}

// ===============================
// UBCRIPTION CHECK (FRONTEND EXAMPLE)
// ===============================
const res = await fetch("http://localhost:5000/api/subscriptions", {
    headers: { Authorization: "Bearer " + token }
});

const sub = await res.json();

if (sub.status !== "active") {
    window.location.href = "../admin/subscription.html";
}

// ===============================
// LOAD DASHBOARD
// ===============================
async function loadDashboard() {
    const data = await apiRequest("/dashboards", "GET");

    if (!data) return;

    const stats = document.getElementById("stats");

    if (!stats) return;

    stats.innerHTML = `
        <div class="card">Students: ${data.totalStudents || 0}</div>
        <div class="card">Parents: ${data.totalParents || 0}</div>
        <div class="card">Teachers: ${data.totalTeachers || 0}</div>
        <div class="card">Revenue: ${data.totalRevenue || 0}</div>
        <div class="card">Performance: ${data.avgPerformance || 0}%</div>
    `;
}

// ===============================
// INIT
// ===============================
loadDashboard();