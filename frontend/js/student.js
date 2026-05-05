// ===============================
// STUDENTS MODULE (FINAL SAAS VERSION)
// ===============================

// ===============================
// LOAD STUDENTS
// ===============================
async function loadStudents() {
    const students = await apiRequest("/students", "GET");

    if (!students) return;

    renderStudents(students);
}

// ===============================
// RENDER STUDENTS
// ===============================
function renderStudents(students) {
    const table = document.getElementById("studentTable");

    if (!table) return;

    table.innerHTML = "";

    students.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.student_class || ""}</td>
                <td>${s.gender || ""}</td>
                <td>
                    <button onclick="editStudent('${s.id}')">Edit</button>
                    <button onclick="deleteStudent('${s.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ===============================
// CREATE / UPDATE STUDENT
// ===============================
async function saveStudent() {
    const id = document.getElementById("student_id") ? .value;
    const name = document.getElementById("name") ? .value;
    const student_class = document.getElementById("studentClass") ? .value;
    const gender = document.getElementById("gender") ? .value;
    const parent_id = document.getElementById("parentSelect") ? .value;

    const payload = {
        name,
        student_class,
        gender,
        parent_id: parent_id || null
    };

    let result;

    if (id) {
        result = await apiRequest(`/students/${id}`, "PUT", payload);
    } else {
        result = await apiRequest("/students", "POST", payload);
    }

    if (result) {
        alert("Saved successfully");
        resetStudentForm();
        loadStudents();
    }
}

// ===============================
// EDIT STUDENT
// ===============================
function editStudent(id) {
    const row = event.target.closest("tr");

    document.getElementById("student_id").value = id;
    document.getElementById("name").value = row.children[0].innerText;
    document.getElementById("studentClass").value = row.children[1].innerText;
    document.getElementById("gender").value = row.children[2].innerText;
}

// ===============================
// DELETE STUDENT
// ===============================
async function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    const result = await apiRequest(`/students/${id}`, "DELETE");

    if (result) {
        alert("Deleted");
        loadStudents();
    }
}

// ===============================
// RESET FORM
// ===============================
function resetStudentForm() {
    const idField = document.getElementById("student_id");
    if (idField) idField.value = "";

    document.getElementById("name").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("gender").value = "";
}