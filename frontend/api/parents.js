// frontend/api/parents.js

import API from "./auth";

// ===============================
// PARENTS API (MULTI-SCHOOL SAAS)
// ===============================

// Create Parent
export const createParent = (data) =>
    API.post("/parents", data);

// Get All Parents (with optional query params)
export const getParents = (params = {}) =>
    API.get("/parents", { params });

// Get Single Parent
export const getParentById = (id) =>
    API.get(`/parents/${id}`);

// Update Parent
export const updateParent = (id, data) =>
    API.put(`/parents/${id}`, data);

// Delete Parent
export const deleteParent = (id) =>
    API.delete(`/parents/${id}`);