import Router from '@koa/router';
import { createOAuthClient } from '../config/googleOAuth.js';
import CalendarConnection from '../models/CalendarConnection.js';
import { google } from 'googleapis';
import { createCalendarConnection } from '../queries/calendarConnectionQueries.js';
import { getValidAccessToken, revokeGoogleAccess } from '../services/googleCalendar.js';
import axios from 'axios';

const router = new Router({
  prefix: '/google',
});

router.get('/events', async (ctx) => {
  const { id } = ctx.query; // however you get it from auth

  try {
    const accessToken = await getValidAccessToken(id);

    const { data } = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    ctx.body = data.items;
  } catch (err) {
    console.error('Error fetching access token:', err);
    ctx.status = 500;
    ctx.body = { error: 'Failed to get access token' };
    return;
  }
});

router.get('/auth/link', async (ctx) => {
  const oauthClient = createOAuthClient();

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline', // required to get a refresh_token
    prompt: 'consent', // forces Google to return refresh_token every time
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state: JSON.stringify({ mensaje: 'Esto deberia ser un ID de una instancia ya creada de CalendarConnection para luego solo actualizar utilizando esta referencia' }), // passed back in the callback
  });

  ctx.response.body = { url };
});

router.get('/auth/callback', async (ctx) => {
  try {
    const { code, state } = ctx.query;

    if (!code) {
      ctx.status = 400;
      ctx.body = { error: 'Authorization code is missing' };
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

    // 4. Save the tokens and account info in the database
    await createCalendarConnection({
      access_token,
      refresh_token,
      token_type,
      scope,
      expiry_date,
      google_account_id,
      email,
    });

    // 5. Redirect back to frontend
    ctx.redirect(`${process.env.FRONTEND_URL}/settings/integrations?success=true`);
  } catch (err) {
    console.error('Google Calendar callback error:', err);
    ctx.redirect(`${process.env.FRONTEND_URL}/settings/integrations?error=true`);
  }
});

router.delete('/auth/disconnect', async (ctx) => {
  const { id } = ctx.query;

  await revokeGoogleAccess(id);

  ctx.status = 200;
  ctx.body = { message: 'Google Calendar disconnected successfully' };
});

export default router;
