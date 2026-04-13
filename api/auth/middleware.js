import { verify } from './jwt.js';

export default async function middleware(ctx, next) {
  const header = ctx.headers.authorization;
  if (!header?.startsWith('Bearer ')) return ctx.throw(401, 'No token');
  try {
    ctx.state.user = verify(header.slice(7)); // koa convention: ctx.state for user
    await next();
  } catch {
    ctx.throw(401, 'Invalid token');
  }
}
