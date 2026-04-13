import Router from '@koa/router';
import googleRoutes from './google.js';
import appointmentsRoutes from './appointments.js';
import authRoutes from './auth.js';

const router = new Router({
  prefix: '/api',
});

router.use(googleRoutes.routes());
router.use(authRoutes.routes());
router.use(appointmentsRoutes.routes());

export default router;
