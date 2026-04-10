import { CLIENT_ID, CLIENT_SECRET } from '../config/index.js';
import CalendarConnection from '../models/CalendarConnection.js';
import axios from 'axios';

async function getValidAccessToken(id) {
  if (!id) {
    throw new Error('Calendar connection ID is required');
  }

  const connection = await CalendarConnection.query().findById(id);

  if (!connection) {
    throw new Error('Calendar connection not found');
  }

  if (!connection.status || connection.status !== 'active') {
    throw new Error('Calendar connection is inactive');
  }

  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const isExpiringSoon = new Date(connection.expiry_date) - Date.now() < FIVE_MINUTES_MS;

  if (!isExpiringSoon) {
    return connection.access_token;
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: connection.refresh_token,
    grant_type: 'refresh_token',
  });

  const { data } = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const newExpiresAt = new Date(Date.now() + data.expires_in * 1000);

  await CalendarConnection.query()
    .findById(id)
    .update({
      access_token: data.access_token,
      expiry_date: newExpiresAt,
      ...(data.refresh_token && { refresh_token: data.refresh_token }),
    });

  return data.access_token;
}

async function revokeGoogleAccess(id) {
  if (!id) {
    throw new Error('Calendar connection ID is required');
  }

  const connection = await CalendarConnection.query().findById(id);

  if (!connection) {
    throw new Error('Calendar connection not found');
  }

  try {
    await axios.post(
      'https://oauth2.googleapis.com/revoke',
      new URLSearchParams({ token: connection.access_token }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  } catch (error) {
    throw new Error('Failed to revoke Google access: ' + error);
  }

  await CalendarConnection.query().findById(id).update({ status: 'inactive' });
}

export { getValidAccessToken, revokeGoogleAccess };
