import Router from '@koa/router';
import googleRoutes from './google.js';

const router = new Router({
  prefix: '/api',
});

router.use(googleRoutes.routes());

export default router;
