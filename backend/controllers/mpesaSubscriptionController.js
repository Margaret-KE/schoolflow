const axios = require("axios");
const db = require("../models");

// ===============================
// GENERATE MPESA ACCESS TOKEN
// ===============================
const getAccessToken = async() => {
    const res = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            auth: {
                username: process.env.MPESA_CONSUMER_KEY,
                password: process.env.MPESA_CONSUMER_SECRET
            }
        }
    );

    return res.data.access_token;
};

// ===============================
// FORMAT PHONE
// ===============================
const formatPhone = (phone) => {
    if (!phone) return "";

    if (phone.startsWith("0")) {
        return "254" + phone.substring(1);
    }

    if (phone.startsWith("+")) {
        return phone.substring(1);
    }

    return phone;
};

// ===============================
// STK PUSH
// ===============================
exports.paySubscription = async(req, res) => {
    try {
        let phone = req.body.phone;
        let amount = req.body.amount;

        if (!phone || !amount) {
            return res.status(400).json({
                success: false,
                message: "Phone and amount required"
            });
        }

        phone = formatPhone(phone);

        const token = await getAccessToken();

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 14);

        const password = Buffer.from(
            process.env.MPESA_SHORTCODE +
            process.env.MPESA_PASSKEY +
            timestamp
        ).toString("base64");

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phone,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: phone,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: "SchoolFlow",
                TransactionDesc: "Subscription Payment"
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        // OPTIONAL: save reference safely
        if (response && response.data && response.data.CheckoutRequestID) {
            await db.Subscription.update({
                mpesa_reference: response.data.CheckoutRequestID
            }, {
                where: { school_id: req.school_id }
            });
        }

        return res.json({
            success: true,
            data: response.data
        });

    } catch (err) {
        console.error(
            "MPESA ERROR:",
            (err && err.response && err.response.data) ?
            err.response.data :
            err.message
        );

        return res.status(500).json({
            success: false,
            message: "STK push failed"
        });
    }
};