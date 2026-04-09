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

async function createEvent(
  calendarId,
  { date, startTime, endTime, email, displayName, summary = 'New Appointment', description = '' },
) {
  if (!date || !startTime || !endTime || !email) {
    throw new Error('Missing required fields: date, startTime, endTime, email');
  }

  try {
    const accessToken = await getValidAccessToken(calendarId);

    if (!accessToken) {
      throw new Error('No valid access token found');
    }

    const { data } = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        summary,
        description,
        start: {
          dateTime: moment(date).set({
            hour: startTime.split(':')[0],
            minute: startTime.split(':')[1],
          }),
        },
        end: {
          dateTime: moment(date).set({
            hour: endTime.split(':')[0],
            minute: endTime.split(':')[1],
          }),
        },
        attendees: [{ email, displayName }],
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return data;
  } catch (err) {
    console.error('Error creating event', err);
    throw err;
  }
}

export { getEvents, createEvent };
