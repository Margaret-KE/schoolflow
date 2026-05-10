module.exports = (req, res, next) => {
    const host = req.headers.host; // school1.schoolflow.com
    const subdomain = host.split(".")[0];

    req.subdomain = subdomain;

    next();
};