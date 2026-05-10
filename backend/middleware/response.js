// middleware/response.js
exports.success = (res, data, message = "OK") => {
    return res.json({
        success: true,
        message,
        data
    });
};

exports.error = (res, message = "Error", code = 400) => {
    return res.status(code).json({
        success: false,
        message
    });
};