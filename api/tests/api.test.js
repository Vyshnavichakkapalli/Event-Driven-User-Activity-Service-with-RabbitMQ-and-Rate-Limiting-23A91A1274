const request = require('supertest');
const app = require('../src/server');
const { publishActivity } = require('../src/services/rabbitmqPublisher');

jest.mock('../src/services/rabbitmqPublisher', () => ({
    connectRabbitMQ: jest.fn().mockResolvedValue(),
    publishActivity: jest.fn().mockResolvedValue()
}));

describe('API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should ingest a valid activity', async () => {
        const payload = {
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            eventType: "user_login",
            timestamp: "2023-10-27T10:00:00Z",
            payload: { ipAddress: "192.168.1.1" }
        };

        const res = await request(app)
            .post('/api/v1/activities')
            .send(payload);

        expect(res.statusCode).toEqual(202);
        expect(res.body).toHaveProperty('message', 'Accepted');
        expect(res.body).toHaveProperty('id');
        expect(publishActivity).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for invalid input', async () => {
        const res = await request(app)
            .post('/api/v1/activities')
            .send({ userId: "123" });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});
