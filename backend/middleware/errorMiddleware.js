export const notFound = (req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);
    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Server error'
    });
};
