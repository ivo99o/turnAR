import ratelimit from 'koa-ratelimit';

export const cheapLimit = ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60_000,
  max: 300,
  id: (ctx) => ctx.ip,
});

export const expensiveLimit = ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60_000,
  max: 20,
  id: (ctx) => ctx.ip,
});
