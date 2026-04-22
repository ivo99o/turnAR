import ratelimit from 'koa-ratelimit';
import { IGNORE_RATE_LIMIT } from '../config/index.js';

export const cheapLimit = ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60_000,
  max: IGNORE_RATE_LIMIT ? 1000000 : 300,
  id: (ctx) => ctx.ip,
});

export const expensiveLimit = ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60_000,
  max: IGNORE_RATE_LIMIT ? 1000000 : 20,
  id: (ctx) => ctx.ip,
});
