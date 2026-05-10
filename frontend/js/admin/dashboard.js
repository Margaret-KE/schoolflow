import {
    checkSubscription,
    getDashboardStats,
    getDashboardAnalytics
} from "../../api/dashboard.js";

// ===============================
// INITIALIZE DASHBOARD
// ===============================
async function initDashboard() {
    try {

        // Verify subscription
        await checkSubscription();

        // ===============================
        // LOAD STATS
        // ===============================
        const stats = await getDashboardStats();

        document.getElementById("students").innerText =
            stats.totalStudents || 0;

        document.getElementById("revenue").innerText =
            stats.totalRevenue || 0;

        document.getElementById("teachers").innerText =
            stats.totalTeachers || 0;

        document.getElementById("payments").innerText =
            stats.totalPayments || 0;

        // ===============================
        // LOAD ANALYTICS
        // ===============================
        const analytics = await getDashboardAnalytics();

        const ctx = document.getElementById("chart");

        new Chart(ctx, {
            type: "line",

            data: {
                labels: analytics.charts.monthlyRevenue.map(
                    item => item.month
                ),

                datasets: [{
                    label: "Revenue",

                    data: analytics.charts.monthlyRevenue.map(
                        item => item.revenue
                    )
                }]
            }
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
    }
}

// ===============================
// START
// ===============================
initDashboard();