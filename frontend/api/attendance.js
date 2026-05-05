// ===============================
// ATTENDANCE API (FINAL SAAS MULTI-SCHOOL)
// ===============================

import API from "./auth";

// ===============================
// MARK ATTENDANCE
// ===============================
export const markAttendance = (data) =>
    API.post("/attendance", data);

// ===============================
// GET ATTENDANCE (OPTIONAL FILTER)
// ===============================
export const getAttendance = (date) =>
    API.get("/attendance", {
        params: date ? { date } : {}
    });

// ===============================
// UPDATE ATTENDANCE
// ===============================
export const updateAttendance = (id, data) =>
    API.put(`/attendance/${id}`, data);

// ===============================
// DELETE ATTENDANCE
// ===============================
export const deleteAttendance = (id) =>
    API.delete(`/attendance/${id}`);

// ===============================
// ATTENDANCE STATS (DASHBOARD)
// ===============================
export const getAttendanceStats = () =>
    API.get("/attendance/stats");

// ===============================
// PARENT VIEW (OWN CHILDREN ONLY)
// ===============================
export const getParentAttendance = () =>
    API.get("/attendance/parent");

// ===============================
// CLASS FILTER VIEW (TEACHER MODE)
// ===============================
export const getClassAttendance = (className) =>
    API.get("/attendance", {
        params: className ? { className } : {}
    });