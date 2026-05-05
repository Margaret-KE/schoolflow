// ===============================
// ATTENDANCE MODULE (FINAL SAAS VERSION)
// ===============================

// ===============================
// AUTH GUARD
// ===============================
if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
}

// ===============================
// LOAD STUDENTS FOR DROPDOWN
// ===============================
async function loadStudents() {
    const students = await apiRequest("/students", "GET");

    if (!students) return;

    const select = document.getElementById("student");

    if (!select) return;

    select.innerHTML = "";

    students.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
}

// ===============================
// MARK ATTENDANCE
// ===============================
async function markAttendance() {
    const student_id = document.getElementById("student") ? .value;
    const date = document.getElementById("date") ? .value;
    const status = document.getElementById("status") ? .value;

    const payload = {
        student_id,
        date,
        status
    };

    const result = await apiRequest("/attendance", "POST", payload);

    if (result) {
        alert("Attendance saved");
        loadAttendance();
    }
}

// ===============================
// LOAD ATTENDANCE RECORDS
// ===============================
async function loadAttendance() {
    const data = await apiRequest("/attendance", "GET");

    if (!data) return;

    const table = document.getElementById("table");

    if (!table) return;

    table.innerHTML = "";

    data.forEach(a => {
        table.innerHTML += `
            <tr>
                <td>${a.Student ? a.Student.name : ""}</td>
                <td>${a.date}</td>
                <td>${a.status}</td>
            </tr>
        `;
    });
}

// ===============================
// INIT
// ===============================
loadStudents();
loadAttendance();