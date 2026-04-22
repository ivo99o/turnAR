import Router from '@koa/router';
import Workspace from '../models/Workspace.js';
import CalendarConnection from '../models/CalendarConnection.js';

const router = new Router({
  prefix: '/home',
});

router.get('/workspace', async (ctx) => {
  const workspace = await Workspace.query().findById(ctx.state.workspace.id);

  ctx.body = workspace;
});

router.get('/user', async (ctx) => {
  const { name, email } = ctx.state.user;

  const connection = await CalendarConnection.query().where('user_id', ctx.state.user.id).first();

  ctx.body = {
    name,
    email,
    calendarStatus: !!connection && connection.status === 'active',
  };
});

export default router;
