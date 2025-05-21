// cd scripts
// node deleteBookings.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB}.qjxuqu5.mongodb.net/test?retryWrites=true&w=majority&appName=EventReactGraphQL`;

(async () => {
  try {
    await mongoose.connect(uri);
    const result = await mongoose.connection.collection('bookings').deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} documents from 'bookings'`);
  } catch (err) {
    console.error('❌ Failed to delete bookings:', err);
  } finally {
    await mongoose.disconnect();
  }
})();