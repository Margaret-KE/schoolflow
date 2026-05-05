// ===============================
// PAYMENTS MODULE (FINAL SAAS VERSION)
// ===============================

// ===============================
// AUTH GUARD
// ===============================
if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
}

// ===============================
// INIT PAYMENTS PAGE
// ===============================
async function loadStudents() {
    const students = await apiRequest("/students", "GET");

    if (!students) return;

    const select = document.getElementById("studentSelect");
    if (!select) return;

    select.innerHTML = "";

    students.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
}

// ===============================
// INITIATE MPESA PAYMENT
// ===============================
async function payFees() {
    const student_id = document.getElementById("studentSelect") ? .value;
    const phone = document.getElementById("phone") ? .value;
    const amount = document.getElementById("amount") ? .value;

    const payload = {
        student_id,
        phone,
        amount
    };

    const result = await apiRequest("/payments/pay", "POST", payload);

    if (result) {
        alert("STK Push sent. Check phone.");
        loadPayments();
    }
}

// ===============================
// LOAD PAYMENTS
// ===============================
async function loadPayments() {
    const data = await apiRequest("/payments", "GET");

    if (!data) return;

    const table = document.getElementById("paymentsTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.Student ? p.Student.name : ""}</td>
                <td>${p.amount}</td>
                <td>${p.status}</td>
                <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</td>
            </tr>
        `;
    });
}

// ===============================
// INIT
// ===============================
loadStudents();
loadPayments();