import mongoose from "mongoose";
import dotenv from "dotenv";

const connectdb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/merobhumi';
    // Check if MongoDB URI is provided
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for better stability
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // In production, you might want to retry connection instead of exiting
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(() => connectdb(), 5000);
    } else {
      console.error('⚠️  Proceeding without MongoDB for local development...');
      // process.exit(1);
    }
  }
};

export default connectdb;