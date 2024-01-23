import dotenv from 'dotenv'
import mongoose from 'mongoose';
import logger from '../logs/logger'

dotenv.config()

export default class Config{
    PORT = process.env.PORT || 3010
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
    GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || ''
    DOMAIN = process.env.DOMAIN || ''
    MONGODB_URI = process.env.MONGODB_URI || ''
    STRIPE_API_KEY = process.env.STRIPE_API_KEY || ''
    SESSION_SECRET = process.env.SESSION_SECRET || ''
}

export function connectDB():void {
  const url = process.env.MONGODB_URI || '';
  try {
    mongoose.connect(url,{
      autoIndex: true,
      dbName: "shopcart"
    });
  } catch (err:any) {
    logger.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    logger.info(`Successfully Connected to Database`);
  });

  dbConnection.on("error", (err) => {
    logger.error(`${err}`)
  });
}




  
