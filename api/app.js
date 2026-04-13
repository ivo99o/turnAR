import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from './knexfile.js';
import passport from './auth/passport.js';
import verifyJWT from './auth/middleware.js';

// initialize knex
const knex = Knex(knexConfig);
Model.knex(knex);

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:5174');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});

// app.use(errorHandler);
app.use(bodyParser());
app.use(passport.initialize());

app.use(router.routes());

app.use(router.allowedMethods());

export default app;
