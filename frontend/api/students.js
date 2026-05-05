// ===============================
// STUDENTS API (FINAL SAAS MULTI-SCHOOL SAFE)
// ===============================

import API from "./auth";

// ===============================
// CREATE STUDENT
// ===============================
export const createStudent = (data) =>
    API.post("/students", data);

// ===============================
// GET ALL STUDENTS (SCHOOL SCOPED)
// ===============================
export const getStudents = () =>
    API.get("/students");

// ===============================
// GET SINGLE STUDENT
// ===============================
export const getStudentById = (id) =>
    API.get(`/students/${id}`);

// ===============================
// PARENT: MY CHILDREN ONLY
// ===============================
export const getMyChildren = () =>
    API.get("/students/my-children");

// ===============================
// UPDATE STUDENT
// ===============================
export const updateStudent = (id, data) =>
    API.put(`/students/${id}`, data);

// ===============================
// DELETE STUDENT
// ===============================
export const deleteStudent = (id) =>
    API.delete(`/students/${id}`);

// ===============================
// BULK IMPORT (SCALING FEATURE)
// ===============================
export const bulkCreateStudents = (data) =>
    API.post("/students/bulk", data);