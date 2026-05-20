const amqp = require('amqplib');
const connectDB = require('./config/db');
const { processActivity } = require('./services/activityProcessor');
const dotenv = require('dotenv');

dotenv.config();

async function startWorker() {
    try {
        await connectDB();
        
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        
        const queue = 'user_activities';
        await channel.assertQueue(queue, { durable: true });
        
        channel.prefetch(1);
        console.log(`Worker waiting for messages in ${queue}.`);
        
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const activityData = JSON.parse(msg.content.toString());
                    await processActivity(activityData);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    channel.nack(msg, false, true);
                }
            }
        });
    } catch (err) {
        console.error('Failed to start worker:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startWorker();
}

module.exports = { startWorker };
