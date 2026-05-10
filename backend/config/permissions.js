const permissions = {
    admin: [
        "students:create",
        "students:view",
        "students:edit",
        "students:delete",
        "students:view_own",

        "attendance:mark",
        "attendance:view",
        "attendance:edit",
        "attendance:delete",

        "payments:create",
        "payments:view",
        "payments:stats",

        "results:create",
        "results:view",
        "results:edit",
        "results:delete",

        "subjects:create",
        "subjects:view",
        "subjects:edit",
        "subjects:delete",

        "dashboard:view"
    ],

    teacher: [
        "students:view",
        "students:view_own",

        "attendance:mark",
        "attendance:view",
        "attendance:edit",

        "results:create",
        "results:view",

        "subjects:view",

        "payments:view"
    ],

    parent: [
        "students:view_own",
        "attendance:view_own",
        "payments:view_own",
        "results:view_own"
    ],

    super_admin: ["*"]
};

module.exports = permissions;