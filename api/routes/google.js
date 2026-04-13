import Router from '@koa/router';
import { createOAuthClient } from '../config/googleOAuth.js';
import CalendarConnection from '../models/CalendarConnection.js';
import { google } from 'googleapis';
import {
  createCalendarConnection,
  updateCalendarConnection,
} from '../queries/calendarConnectionQueries.js';
import { revokeGoogleAccess } from '../services/googleCalendar.js';
import verifyJWT from '../auth/middleware.js';
import { FRONTEND_URL_CALLBACK, JWT_SECRET } from '../config/index.js';
import { sign, verify } from '../auth/jwt.js';

const router = new Router({
  prefix: '/google',
});

// router.use(verifyJWT);

router.get('/auth/link', verifyJWT, async (ctx) => {
  const oauthClient = createOAuthClient();

  const user = ctx.state.user;

  if (!user || !user.id) {
    ctx.status = 400;
    ctx.body = { error: 'User ID is required' };
    return;
  }

  let connection;

  connection = await CalendarConnection.query().where({ user_id: user.id }).first();

  if (!connection) {
    connection = await createCalendarConnection({
      user_id: user.id,
      access_token: '',
      refresh_token: '',
      token_type: '',
      scope: '',
      expiry_date: new Date(),
      google_account_id: '',
      email: '',
      status: 'pending',
    });
  } else {
    await updateCalendarConnection(connection.id, {
      status: 'pending',
    });
  }

  const state = sign(
    { userId: ctx.state.user.id, connectionId: connection.id },
    process.env.JWT_SECRET,
    {
      expiresIn: '10m',
    },
  );

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state,
  });

  ctx.response.body = { url };
});

router.get('/auth/callback', async (ctx) => {
  const { code, state } = ctx.query;

  // Verify state
  let payload;
  try {
    payload = verify(state, JWT_SECRET);
  } catch {
    ctx.throw(401, 'Invalid or expired state');
  }

  const { userId, connectionId } = payload;

  try {
    if (!code) {
      ctx.status = 400;
      ctx.body = { error: 'Authorization code is missing' };
      return;
    }

    if (!userId || !connectionId) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid state parameter' };
      return;
    }

    // 2. Exchange the code for tokens
    const oauthClient = createOAuthClient();
    const { tokens } = await oauthClient.getToken(code);
    const { access_token, refresh_token, token_type, scope, expiry_date } = tokens;

    // 3. Fetch the Google account info
    oauthClient.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauthClient });
    const { data } = await oauth2.userinfo.get();
    const { id: google_account_id, email } = data;

    const connection = await CalendarConnection.query().findById(connectionId);

    if (!connection) {
      throw new Error('Calendar connection not found');
    }

    if (connection.user_id !== userId) {
      throw new Error('User ID mismatch');
    }

    if (connection.google_account_id && connection.google_account_id !== google_account_id) {
      throw new Error('Google account mismatch');
    }

    // 4. Save the tokens and account info in the database
    await updateCalendarConnection(connectionId, {
      access_token,
      refresh_token,
      token_type,
      scope,
      expiry_date: new Date(expiry_date),
      google_account_id,
      email,
      status: 'active',
    });

    // 5. Redirect back to frontend
    ctx.redirect(`${FRONTEND_URL_CALLBACK}?success=true`);
  } catch (err) {
    if (connectionId) await updateCalendarConnection(connectionId, { status: 'error' });

    console.error('Google Calendar callback error:', err);
    ctx.redirect(`${FRONTEND_URL_CALLBACK}?error=true`);
  }
});

router.get('/connection', verifyJWT, async (ctx) => {
  const user = ctx.state.user;

  if (!user || !user.id) {
    ctx.status = 400;
    ctx.body = { error: 'User ID is required' };
    return;
  }

  const connection = await CalendarConnection.query().where({ user_id: user.id }).first();

  if (!connection) {
    ctx.status = 404;
    ctx.body = { error: 'No Google Calendar connection found' };
    return;
  }

  ctx.body = {
    email: connection.email,
    status: connection.status,
  };
});

router.delete('/auth/disconnect', verifyJWT, async (ctx) => {
  const { id } = ctx.query;

  await revokeGoogleAccess(id);

  ctx.status = 200;
  ctx.body = { message: 'Google Calendar disconnected successfully' };
});

router.get('/protected', async (ctx) => {
  ctx.body = ctx.state.user;
});

export default router;
