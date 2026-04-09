import Router from '@koa/router';
import User from '../models/User.js';
import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';
import moment from 'moment';
import { getEvents } from '../services/events.js';

const router = new Router({
  prefix: '/appointments',
});

const DEFAULT_APPOINTMENT_DURATION = 30; // in minutes
const DEFAULT_LIMIT_DAYS_AHEAD = 7; // how many days ahead to calculate available appointments

router.get('/:userId/available-appointments', async (ctx) => {
  const { userId } = ctx.params;

  // const user = await User.query().findById(userId).first();

  let calendars = await CalendarConnection.query()
    .where('user_id', userId)
    .where('is_active', true);

  // remove duplicates from calendars (if any) using lodash _
  calendars = _.uniqBy(calendars, 'calendar_id');

  let availableAppointments = generateDefaultAvailableAppointments(
    DEFAULT_LIMIT_DAYS_AHEAD,
    DEFAULT_APPOINTMENT_DURATION,
  );

  for (const calendar of calendars) {
    // service: getEvents(calendar.calendar_id)
    const events = await getEvents(calendar.id, {
      startDate: moment(),
      endDate: moment().add(DEFAULT_LIMIT_DAYS_AHEAD, 'days'),
    });

    console.log(`Events for calendar ${calendar.calendar_id}:`, events);

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

  let dates = [];

  const numberOfSlotsPerDay = Math.floor((24 * 60) / appointmentDuration);

  let defaultSchedule = [];

  const startTime = moment().startOf('day');

  for (let i = 0; i < numberOfSlotsPerDay; i++) {
    defaultSchedule.push({
      startTime: startTime.add(i * appointmentDuration, 'minutes').format('HH:mm'),
      isBooked: false,
    });
  }

  for (let i = 0; i < limitDaysAhead; i++) {
    const date = moment(today).add(i, 'days').format('YYYY-MM-DD');
    dates.push({ date, slots: defaultSchedule });
  }

  return dates;
}

export default router;
