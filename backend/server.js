const app = require("./app");

const PORT = process.env.PORT || 5000;

const sequelize = require("./config/db");

sequelize.sync().then(() => {
    console.log("Database connected and synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});