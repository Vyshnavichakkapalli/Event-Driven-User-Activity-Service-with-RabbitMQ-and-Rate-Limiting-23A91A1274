const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50', 10);

const requestCounts = new Map();

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, { count: 1, resetTime: currentTime + WINDOW_MS });
        return next();
    }
    
    const clientData = requestCounts.get(ip);
    
    if (currentTime > clientData.resetTime) {
        clientData.count = 1;
        clientData.resetTime = currentTime + WINDOW_MS;
        return next();
    }
    
    clientData.count++;
    
    if (clientData.count > MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil((clientData.resetTime - currentTime) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({ error: 'Too Many Requests' });
    }
    
    next();
}

// Memory cleanup
setInterval(() => {
    const currentTime = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
        if (currentTime > data.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, WINDOW_MS * 2).unref();

module.exports = { rateLimiter };
