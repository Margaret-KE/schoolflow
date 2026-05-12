const permissions = {

    admin: [

        // USERS
        "users:create",
        "users:view",
        "users:update",
        "users:delete",

        // STUDENTS
        "students:create",
        "students:view",
        "students:update",
        "students:delete",
        "students:view_own",

        // ATTENDANCE
        "attendance:create",
        "attendance:view",
        "attendance:update",
        "attendance:delete",
        "attendance:view_own",

        // PAYMENTS
        "payments:create",
        "payments:view",
        "payments:stats",
        "payments:view_own",

        // RESULTS
        "results:create",
        "results:view",
        "results:update",
        "results:delete",
        "results:view_own",

        // SUBJECTS
        "subjects:create",
        "subjects:view",
        "subjects:update",
        "subjects:delete",

        // PARENTS
        "parents:create",
        "parents:view",
        "parents:update",
        "parents:delete",

        // REPORTS
        "reports:view",
        "analytics:view",

        // SETTINGS
        "settings:view",
        "settings:update",

        // SUBSCRIPTION
        "subscription:view",
        "subscription:update",

        // DASHBOARD
        "dashboard:view"
    ],

    teacher: [

        "students:view",
        "students:view_own",

        "attendance:create",
        "attendance:view",
        "attendance:update",

        "results:create",
        "results:view",
        "results:update",

        "subjects:view",

        "dashboard:view"
    ],

    parent: [

        "students:view_own",
        "attendance:view_own",
        "payments:view_own",
        "results:view_own",
        "dashboard:view"
    ],

    super_admin: ["*"]
};

module.exports = permissions;