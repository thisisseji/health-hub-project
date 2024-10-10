const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    // Log the error event
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');

    // Log the error to the console
    console.error(err.stack);

    const status = res.statusCode ? res.statusCode : 500 // server error

    res.status(status)

    res.json({ message: err.message})

};

module.exports = errorHandler;