import Router from '@koa/router';
import passport from 'koa-passport';
import bcrypt from 'bcrypt';
import { sign } from '../auth/jwt.js';
import User from '../models/User.js';

const router = new Router({ prefix: '/auth' });

router.post('/register', async (ctx) => {
  const { email, password } = ctx.request.body;
  const hash = await bcrypt.hash(password, 12);

  const user = await User.query().insertAndFetch({
    email,
    password_hash: hash,
    workspace_id: '353cf7d4-ecb0-4717-acbf-9c0f6b9a884f',
  });
  const token = sign({ ...user });

  ctx.body = { token };
});

router.post('/login', async (ctx, next) => {
  return passport.authenticate('local', { session: false }, (err, user, info) => {
    if (!user) ctx.throw(401, info?.message ?? 'Invalid credentials');

    const token = sign(user);

    ctx.body = { token };
  })(ctx, next);
});

export default router;
