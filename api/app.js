import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from './knexfile.js';

// initialize knex
const knex = Knex(knexConfig);
Model.knex(knex);

const app = new Koa();

// app.use(errorHandler);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
