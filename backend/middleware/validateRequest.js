// middleware/validateRequest.js

const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((e) => e.message)
                });
            }

            next();

        } catch (err) {
            console.error("VALIDATION MIDDLEWARE ERROR:", err);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
};

module.exports = validateRequest;