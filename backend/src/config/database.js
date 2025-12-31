/**
 * MongoDB Database Configuration
 * Establishes connection to MongoDB Atlas using Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to MongoDB with retry logic
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        console.log('🔄 Connecting to MongoDB...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);

        // Retry connection after 5 seconds
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

/**
 * Gracefully close MongoDB connection
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('👋 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
    }
};

export { connectDB, disconnectDB };
