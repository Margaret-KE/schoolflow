const router = require("express").Router();
const db = require("../models");

// ===============================
// SAFE METADATA EXTRACTOR
// ===============================
const getMetaValue = (items, name) => {
    if (!items || !Array.isArray(items)) return null;

    const found = items.find((i) => i.Name === name);
    return found ? found.Value : null;
};

// ===============================
// MPESA CALLBACK
// ===============================
router.post("/callback", async(req, res) => {
    try {
        const body = req.body;

        if (!body || !body.Body || !body.Body.stkCallback) {
            return res.json({ success: false });
        }

        const callback = body.Body.stkCallback;

        // ===============================
        // SUCCESS PAYMENT
        // ===============================
        if (callback.ResultCode === 0) {
            const items = callback.CallbackMetadata ?
                callback.CallbackMetadata.Item : [];

            const phone = getMetaValue(items, "PhoneNumber");
            const checkoutId = callback.CheckoutRequestID;

            // ===============================
            // FIND SUBSCRIPTION BY MPESA REF
            // ===============================
            let subscription = null;

            if (checkoutId) {
                subscription = await db.Subscription.findOne({
                    where: { mpesa_reference: checkoutId }
                });
            }

            // fallback (not ideal but safe)
            if (!subscription && phone) {
                const school = await db.School.findOne({
                    where: { phone: phone }
                });

                if (school) {
                    subscription = await db.Subscription.findOne({
                        where: { school_id: school.id }
                    });
                }
            }

            // ===============================
            // ACTIVATE SUBSCRIPTION
            // ===============================
            if (subscription) {
                const endDate = new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                );

                await db.Subscription.update({
                    status: "active",
                    start_date: new Date(),
                    end_date: endDate,
                    next_billing_date: endDate
                }, {
                    where: { id: subscription.id }
                });
            }
        }

        // MPESA requires success response always
        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    } catch (err) {
        console.error(
            "MPESA CALLBACK ERROR:",
            err && err.message ? err.message : err
        );

        return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
});

module.exports = router;