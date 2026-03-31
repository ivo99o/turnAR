import Router from '@koa/router';
import { createOAuthClient } from '../config/googleOAuth.js';
import CalendarConnection from '../models/CalendarConnection.js';
import { google } from 'googleapis';
import { createCalendarConnection } from '../queries/calendarConnectionQueries.js';

const router = new Router({
  prefix: '/google',
});

router.get('/connect', async (ctx) => {
  const oauthClient = createOAuthClient();

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline', // required to get a refresh_token
    prompt: 'consent', // forces Google to return refresh_token every time
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state: JSON.stringify({ mensaje: 'Esto vuelve en el callback' }), // passed back in the callback
  });

  ctx.response.body = { url };
});

router.get('/auth/callback', async (ctx) => {
  try {
    const { code, state } = ctx.query;

    console.log(state);

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

export default router;
