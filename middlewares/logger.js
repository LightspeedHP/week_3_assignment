const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${req.method} request sent to ${req.url} from ${req.ip} at ${timestamp}`);
    next();
};

module.exports = logger;