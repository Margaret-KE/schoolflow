const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const resultRoutes = require("./routes/resultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboards", dashboardRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/fee", feeRoutes);
app.use("/api/parents", parentRoutes);

// Routes (we will add later)
app.get("/", (req, res) => {
    res.send("SchoolFlow SaaS API running");
});

module.exports = app;