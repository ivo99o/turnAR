const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status,
      },
    };
  }
};

export default errorHandler;
