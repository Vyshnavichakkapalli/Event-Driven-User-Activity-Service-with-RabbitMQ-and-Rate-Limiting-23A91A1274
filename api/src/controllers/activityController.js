const { v4: uuidv4 } = require('uuid');
const { publishActivity } = require('../services/rabbitmqPublisher');

async function ingestActivity(req, res) {
    try {
        const activity = {
            id: uuidv4(),
            ...req.validatedActivity
        };
        
        await publishActivity(activity);
        
        res.status(202).json({ message: 'Accepted', id: activity.id });
    } catch (err) {
        console.error('Error publishing activity:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { ingestActivity };
