import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
