let africastalkingInstance = null;

try {
    africastalkingInstance = require("africastalking")({
        apiKey: process.env.AT_API_KEY,
        username: process.env.AT_USERNAME
    });
} catch (error) {
    console.error("Africa's Talking init error:", error.message);
}

const sms = africastalkingInstance && africastalkingInstance.SMS;

// ===============================
// SMS SERVICE (SAAS CORE)
// ===============================
exports.sendSMS = async(phone, message) => {
    try {
        if (!sms) {
            return { success: false, error: "SMS service not initialized" };
        }

        if (!phone || !message) {
            return { success: false, error: "Missing phone or message" };
        }

        const response = await sms.send({
            to: [phone],
            message: message,
            from: process.env.SENDER_ID || "SCHOOLFLOW"
        });

        return { success: true, response: response };

    } catch (error) {
        return { success: false, error: error && error.message ? error.message : "SMS error" };
    }
};

// ===============================
// BULK SMS (SAAS FEATURE)
// ===============================
exports.sendBulkSMS = async(phones, message) => {
    try {
        if (!sms) {
            return { success: false, error: "SMS service not initialized" };
        }

        if (!phones || !phones.length || !message) {
            return { success: false, error: "Missing phones or message" };
        }

        const response = await sms.send({
            to: phones,
            message: message,
            from: process.env.SENDER_ID || "SCHOOLFLOW"
        });

        return { success: true, response: response };

    } catch (error) {
        return { success: false, error: error && error.message ? error.message : "Bulk SMS error" };
    }
};