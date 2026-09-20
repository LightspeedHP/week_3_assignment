const errorHandler = (err, req, res, next) => {
    console.error(err.mesaage);
    const status = err.status || 500;
    res.status(status).json({error: err.message});
};

module.exports = errorHandler;