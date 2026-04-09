import Router from '@koa/router';
import User from '../models/User.js';
import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';
import { getValidAccessToken } from '../services/googleCalendar.js';
import axios from 'axios';
import moment from 'moment';
// import { authenticate } from '@google-cloud/local-auth';

const router = new Router({
  prefix: '/appointments',
});

// this defaults should then be workspace/user relative
const DEFAULT_APPOINTMENT_DURATION = 30; // in minutes
const DEFAULT_LIMIT_DAYS_AHEAD = 7; // how many days ahead to calculate available appointments

router.get('/:userId/available-appointments', async (ctx) => {
  const { userId } = ctx.params;

  // in line query: getUserById(userId)
  const user = await User.query().findById(userId).first();

  // in line query: getUserCalendars(userId)
  let calendars = await CalendarConnection.query()
    .where('user_id', userId)
    .where('is_active', true);

  // remove duplicates from calendars (if any) using lodash _
  calendars = _.uniqBy(calendars, 'calendar_id');

  // for each calendar: service: getEvents(calendarId)
  let availableAppointments = generateDefaultAvailableAppointments(
    DEFAULT_APPOINTMENT_DURATION,
    DEFAULT_LIMIT_DAYS_AHEAD,
  );

  for (const calendar of calendars) {
    // service: getEvents(calendar.calendar_id)
    try {
      const accessToken = await getValidAccessToken(calendar.id);

      const {
        data: { items },
      } = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          timeMin: new Date().toISOString(),
          timeMax: new Date(
            Date.now() + DEFAULT_LIMIT_DAYS_AHEAD * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      });

      // ctx.body = data.items;
    } catch (err) {
      console.error('Error fetching access token:', err);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get access token' };
      return;
    }

    // flatten all events into a single object/array
  }

  // flatten all events into a single object/array

  // service: calculateAvailableAppointments(events, userId)

  ctx.body = availableAppointments;
  // return available appointments
});

// TODO: This should eventually use the user availability preferences for the default generated appointmnets.
function generateDefaultAvailableAppointments(limitDaysAhead, appointmentDuration) {
  const today = moment().format('YYYY-MM-DD');

  let dates = { today: [] };

  for (let i = 0; i < limitDaysAhead; i++) {
    const date = moment(today).add(i, 'days').format('YYYY-MM-DD');
    dates[date] = [];
  }

  const numberOfSlotsPerDay = Math.floor((24 * 60) / appointmentDuration);

  let defaultSchedule = [];

  for (let i = 0; i < numberOfSlotsPerDay; i++) {
    const start = moment()
      .startOf('day')
      .add(i * appointmentDuration, 'minutes');
    const end = moment(start).add(appointmentDuration, 'minutes');
    defaultSchedule.push({ start: start.format(), end: end.format(), isBooked: false });
  }

  return dates;
}

export default router;
