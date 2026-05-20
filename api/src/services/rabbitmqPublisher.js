const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('user_activities', { durable: true });
        console.log('Connected to RabbitMQ and asserted queue: user_activities');
    } catch (err) {
        console.error('RabbitMQ connection error:', err);
        throw err;
    }
}

async function publishActivity(activity) {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    const messageBuffer = Buffer.from(JSON.stringify(activity));
    channel.sendToQueue('user_activities', messageBuffer, { persistent: true });
}

module.exports = { connectRabbitMQ, publishActivity };
