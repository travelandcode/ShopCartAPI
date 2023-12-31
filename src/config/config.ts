import dotenv from 'dotenv'
import mongoose from 'mongoose';
import logger from '../logs/logger';

dotenv.config();

export default class Config{
    PORT = process.env.PORT || 3010
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
    GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || ''
    TWITTER_CLIENT_ID = process.env.TWITTER_CONSUMER_KEY || ''
    TWITTER_CLIENT_SECRET = process.env.TWITTER_CONSUMER_SECRET || ''
    TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || ''
    FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || ''
    FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || ''
    FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || ''
    MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || ''
    MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || ''
    MICROSOFT_CALLBACK_URL = process.env.MICROSOFT_CALLBACK_URL || ''
    DOMAIN = process.env.DOMAIN || ''
    MONGODB_URI = process.env.MONGODB_URI || ''
    STRIPE_API_KEY = process.env.STRIPE_API_KEY || ''
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
      logger.error(`${err}`);
    });
  }
  
