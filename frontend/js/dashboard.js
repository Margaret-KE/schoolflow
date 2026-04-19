// 🔐 Protect page FIRST
if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
}

// Then run dashboard logic
async function loadDashboard() {
    const data = await apiRequest("/dashboard");

    document.getElementById("stats").innerHTML = `
        <div class="card">Students: ${data.totalStudents}</div>
        <div class="card">Parents: ${data.totalParents}</div>
        <div class="card">Teachers: ${data.totalTeachers}</div>
        <div class="card">Revenue: ${data.totalRevenue}</div>
        <div class="card">Performance: ${data.avgPerformance}%</div>
    `;

}

loadDashboard();