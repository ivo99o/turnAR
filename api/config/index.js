import dotenv from 'dotenv';

dotenv.config();

// server port
export const PORT = process.env.PORT;

// database configuration
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';

// googleOAuth configuration
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const FRONTEND_URL_CALLBACK = process.env.FRONTEND_URL_CALLBACK;

// JWT secret
export const JWT_SECRET = process.env.JWT_SECRET;
