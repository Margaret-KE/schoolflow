const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ===============================
// SECURITY (SAAS HARDENING)
// ===============================
app.use(helmet());

// ===============================
// RATE LIMITING
// ===============================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, try again later."
    }
});

// Apply limiter only to API
app.use("/api", limiter);

// ===============================
// CORS
// ===============================
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",

    // Live Server
    "http://localhost:8080",
    "http://127.0.0.1:8080",

    // Production
    "https://yourdomain.com"
];

const corsOptions = {
    origin: function(origin, callback) {

        // Allow Postman/mobile apps
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("❌ Blocked by CORS:", origin);

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
};

app.use(cors(corsOptions));

// Preflight requests
app.options(/.*/, cors(corsOptions));

// ===============================
// BODY PARSING
// ===============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SchoolFlow SaaS API running",
        version: "1.0.0"
    });
});

// ===============================
// ROUTES
// ===============================
const routes = require("./routes");

app.use("/api", routes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

module.exports = app;