import Router from '@koa/router';
import googleRoutes from './google.js';
import appointmentsRoutes from './appointments.js';
import authRoutes from './auth.js';
import { cheapLimit, expensiveLimit } from '../middlewares/rateLimit.js';

const router = new Router({
  prefix: '/api',
});

// Public routes
router.use(cheapLimit, appointmentsRoutes.routes());
router.use(cheapLimit, authRoutes.routes());

// Partly public (callback)
router.use(expensiveLimit, googleRoutes.routes());

export default router;
