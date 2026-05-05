// ===============================
// PAYMENTS API (FINAL SAAS + MPESA READY)
// ===============================

import API from "./auth";

// ===============================
// INITIATE MPESA STK PUSH
// ===============================
export const initiatePayment = (data) =>
    API.post("/payments/pay", data);

// ===============================
// GET ALL PAYMENTS (SCHOOL CONTEXT SAFE)
// ===============================
export const getPayments = (params) =>
    API.get("/payments", { params });

// ===============================
// PAYMENT DASHBOARD STATS
// ===============================
export const getPaymentStats = () =>
    API.get("/payments/stats");

// ===============================
// GET SINGLE PAYMENT
// ===============================
export const getPaymentById = (id) =>
    API.get(`/payments/${id}`);

// ===============================
// RETRY FAILED PAYMENT
// ===============================
export const retryPayment = (id) =>
    API.post(`/payments/${id}/retry`);