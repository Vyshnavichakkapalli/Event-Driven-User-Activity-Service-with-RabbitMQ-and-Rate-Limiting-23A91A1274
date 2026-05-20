const request = require('supertest');
const express = require('express');
const { rateLimiter } = require('../src/middlewares/rateLimiter');

const app = express();
app.use(express.json());
app.post('/test', rateLimiter, (req, res) => res.status(200).send('OK'));

describe('Rate Limiter Middleware', () => {
    it('should limit requests over MAX_REQUESTS', async () => {
        const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50', 10);
        
        let res;
        for (let i = 0; i < MAX_REQUESTS; i++) {
            res = await request(app).post('/test').set('X-Forwarded-For', '127.0.0.1');
            expect(res.statusCode).toEqual(200);
        }
        
        // 51st request
        res = await request(app).post('/test').set('X-Forwarded-For', '127.0.0.1');
        expect(res.statusCode).toEqual(429);
        expect(res.body).toHaveProperty('error', 'Too Many Requests');
        expect(res.headers).toHaveProperty('retry-after');
    });
});
