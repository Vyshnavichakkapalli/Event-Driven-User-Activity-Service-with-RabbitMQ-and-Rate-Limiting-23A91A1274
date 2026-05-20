const mongoose = require('mongoose');

async function connectDB() {
    try {
        const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/activity_db';
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

module.exports = connectDB;
