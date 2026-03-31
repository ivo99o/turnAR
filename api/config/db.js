import pg from 'pg';
import dotenv from 'dotenv';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './index.js';

dotenv.config();

const { Pool } = pg;

console.log(DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD);

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export default pool;
