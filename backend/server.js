require("dotenv").config();
require("./models");

const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 5000;

let server;

// ===============================
// GLOBAL ERROR HANDLING
// ===============================
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);

    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

// Optional: Node warnings (memory leaks, deprecations, etc.)
process.on("warning", (warning) => {
    console.warn("WARNING:", warning);
});

// ===============================
// START SERVER
// ===============================
const startServer = async() => {
    try {
        console.log(`Running in ${process.env.NODE_ENV || "production"} mode`);

        // ===============================
        // DB CONNECTION
        // ===============================
        await sequelize.authenticate();
        console.log("✅ Database connected");

        // ===============================
        // START SERVER
        // ===============================
        server = app.listen(PORT, () => {
            console.log(`🚀 SchoolFlow SaaS running on port ${PORT}`);
            console.log("✅ Server ready to accept requests");
        });

        server.on("error", (err) => {
            console.error("SERVER ERROR:", err);
        });

        // ===============================
        // GRACEFUL SHUTDOWN
        // ===============================
        const shutdown = async() => {
            console.log("Shutdown signal received...");

            if (!server) process.exit(0);

            server.close(async() => {
                try {
                    await sequelize.close();
                    console.log("✅ Database connection closed");
                } catch (err) {
                    console.error("Error closing DB:", err.message);
                }

                process.exit(0);
            });
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);

    } catch (error) {
        console.error("SERVER START ERROR:", error);
        process.exit(1);
    }
};

startServer();