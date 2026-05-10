const axios = require("axios");
const { Transaction, Subscription } = require("../models");

// ===============================
// MPESA CONFIG
// ===============================
const BASE_URL =
    process.env.MPESA_ENV === "production" ?
    "https://api.safaricom.co.ke" :
    "https://sandbox.safaricom.co.ke";

// ===============================
// TOKEN CACHE
// ===============================
let cachedToken = null;
let tokenExpiry = null;

// ===============================
// GET ACCESS TOKEN
// ===============================
const getAccessToken = async() => {
    const now = Date.now();

    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await axios.get(
            BASE_URL + "/oauth/v1/generate?grant_type=client_credentials", {
                auth: {
                    username: process.env.MPESA_CONSUMER_KEY,
                    password: process.env.MPESA_CONSUMER_SECRET
                }
            }
        );

        const token =
            response &&
            response.data &&
            response.data.access_token ?
            response.data.access_token :
            null;

        if (!token) throw new Error("No token received");

        cachedToken = token;
        tokenExpiry = now + 50 * 60 * 1000;

        return token;
    } catch (error) {
        console.error(
            "MPESA TOKEN ERROR:",
            error && error.response && error.response.data ?
            error.response.data :
            error.message
        );

        throw new Error("Failed to generate MPESA token");
    }
};

// ===============================
// FORMAT PHONE
// ===============================
const formatPhone = (phone) => {
    if (!phone) return null;

    if (phone.indexOf("0") === 0) return "254" + phone.slice(1);
    if (phone.indexOf("254") === 0) return phone;

    return phone;
};

// ===============================
// STK PUSH
// ===============================
exports.stkPush = async(phone, amount, meta = {}) => {
    try {
        const token = await getAccessToken();
        const formattedPhone = formatPhone(phone);

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 14);

        const password = Buffer.from(
            process.env.MPESA_SHORTCODE +
            process.env.MPESA_PASSKEY +
            timestamp
        ).toString("base64");

        const payload = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(Number(amount)),
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: meta.schoolId ?
                "SCHOOL_" + meta.schoolId : "SchoolFlow",
            TransactionDesc: meta.plan ?
                "Subscription " + meta.plan : "School Payment"
        };

        const res = await axios.post(
            BASE_URL + "/mpesa/stkpush/v1/processrequest",
            payload, {
                headers: {
                    Authorization: "Bearer " + token
                },
                timeout: 15000
            }
        );

        const data = res && res.data ? res.data : {};

        // ===============================
        // SAVE TRANSACTION (SEQUELIZE ONLY)
        // ===============================
        await Transaction.create({
            schoolId: meta.schoolId || null,
            userId: meta.userId || null,
            phone: formattedPhone,
            amount: amount,
            plan: meta.plan || null,
            checkoutRequestID: data.CheckoutRequestID || null,
            merchantRequestID: data.MerchantRequestID || null,
            status: "PENDING"
        });

        return data;
    } catch (error) {
        console.error(
            "MPESA STK ERROR:",
            error && error.response && error.response.data ?
            error.response.data :
            error.message
        );

        return null;
    }
};

// ===============================
// CALLBACK HANDLER
// ===============================
exports.handleCallback = async(callbackData) => {
    try {
        const stk =
            callbackData &&
            callbackData.Body &&
            callbackData.Body.stkCallback ?
            callbackData.Body.stkCallback :
            null;

        if (!stk) return;

        const checkoutId = stk.CheckoutRequestID;
        const resultCode = stk.ResultCode;

        if (!checkoutId) return;

        const transaction = await Transaction.findOne({
            where: { checkoutRequestID: checkoutId }
        });

        if (!transaction) return;

        if (resultCode === 0) {
            transaction.status = "SUCCESS";
            await transaction.save();

            // ===============================
            // ACTIVATE SUBSCRIPTION
            // ===============================
            if (transaction.schoolId) {
                await Subscription.update({
                    status: "active",
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }, {
                    where: { schoolId: transaction.schoolId }
                });
            }
        } else {
            transaction.status = "FAILED";
            await transaction.save();
        }
    } catch (err) {
        console.error(
            "MPESA CALLBACK ERROR:",
            err && err.message ? err.message : err
        );
    }
};