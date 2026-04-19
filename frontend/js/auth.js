// LOGIN
async function loginUser(email, password) {
    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "admin") {
            window.location.href = "../admin/dashboard.html";
        } else if (data.user.role === "parent") {
            window.location.href = "../parent/dashboard.html";
        }
    } else {
        alert(data.message || "Login failed");
    }
}