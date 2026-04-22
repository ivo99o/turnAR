export default async function workspaceMiddleware(ctx, next) {
  const workspaceId = ctx.state.user?.workspace_id;
  if (!workspaceId) return ctx.throw(403, 'No workspace');

  ctx.state.workspace = { id: workspaceId }; 
  await next();
}
