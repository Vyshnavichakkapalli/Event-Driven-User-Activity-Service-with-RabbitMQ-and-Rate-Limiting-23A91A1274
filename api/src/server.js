const express = require('express');
const dotenv = require('dotenv');
const activityRoutes = require('./routes/activityRoutes');
const { connectRabbitMQ } = require('./services/rabbitmqPublisher');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1/activities', activityRoutes);

app.get('/api/v1/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.API_PORT || process.env.PORT || 3000;

async function startServer() {
    try {
        await connectRabbitMQ();
        app.listen(PORT, () => {
            console.log(`API Service listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;
