import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './config/index.js';

export default {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  migrations: {
    directory: './migrations',
  },
};
