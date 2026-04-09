import moment from 'moment';
import { getValidAccessToken } from '../services/googleCalendar.js';
import axios from 'axios';

async function getEvents(
  calendarId,
  { startDate = moment(), endDate = moment().add(7, 'days') } = {},
) {
  try {
    const accessToken = await getValidAccessToken(calendarId);

    if (!accessToken) {
      throw new Error('No valid access token found');
    }

    const {
      data: { items },
    } = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        timeMin: startDate ? startDate.toISOString() : undefined,
        timeMax: endDate ? endDate.toISOString() : undefined,
      },
    });

    return items;
  } catch (err) {
    console.error('Error fetching access token', err);
    return;
  }
}

export { getEvents };
