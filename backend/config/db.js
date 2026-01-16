const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Keep URI without a hard-coded DB name so we can choose DB via option
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    // DB name can be set in .env as MONGO_DB_NAME. Default to Movie_System_Db
    const dbName = process.env.MONGO_DB_NAME || 'Movie_System_Db';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
    });
    console.log('MongoDB connected successfully ✓');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Please check:');
    console.log('1. Your internet connection');
    console.log('2. MongoDB Atlas cluster is running');
    console.log('3. Your IP is whitelisted in MongoDB Atlas');
    console.log('4. MONGO_URI in .env is correct');
    // Don't exit - let server run for other testing
    console.log('\nServer will continue running without database connection...');
  }
};

module.exports = connectDB;
