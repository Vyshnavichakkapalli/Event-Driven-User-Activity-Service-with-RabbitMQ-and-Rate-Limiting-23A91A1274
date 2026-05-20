const Activity = require('../models/activitySchema');

async function processActivity(activityData) {
    try {
        const activity = new Activity({
            id: activityData.id,
            userId: activityData.userId,
            eventType: activityData.eventType,
            timestamp: activityData.timestamp,
            payload: activityData.payload
        });
        await activity.save();
        return true;
    } catch (err) {
        if (err.code === 11000) {
            console.warn(`Duplicate activity ID ignored: ${activityData.id}`);
            return true; // Already processed
        }
        throw err;
    }
}

module.exports = { processActivity };
