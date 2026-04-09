import Router from '@koa/router';
import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';
import generateSchedule, {
  generateDefaultSlots,
  getGoogleCalendarEvents,
} from '../services/schedules.js';
import { createEvent, getEvents } from '../services/events.js';
import moment from 'moment';

const router = new Router({
  prefix: '/appointments',
});

router.get('/:calendarId/appointments-schedule', async (ctx) => {
  const { calendarId } = ctx.params;
  const { limitDaysAhead, appointmentDuration } = ctx.query;

  let calendar = await CalendarConnection.query()
    .where('id', calendarId)
    .where('is_active', true)
    .first();

  if (!calendar || calendar.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Calendar not found' };
    return;
  }

  const defaultSlots = generateDefaultSlots({ appointmentDuration });
  const calendarEventsByDate = await getGoogleCalendarEvents(calendar.id, { limitDaysAhead });
  const schedule = generateSchedule(defaultSlots, calendarEventsByDate, limitDaysAhead);

  ctx.body = schedule;
});

router.post('/:calendarId/book-appointment', async (ctx) => {
  const { calendarId } = ctx.params;
  const { date, startTime, endTime, email, ...query } = ctx.query;

  if (!date || !startTime || !endTime || !email) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields: date, startTime, endTime, email' };
    return;
  }

  if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid date format. Expected format: YYYY-MM-DD' };
    return;
  }

  if (!moment(startTime, 'HH:mm', true).isValid() || !moment(endTime, 'HH:mm', true).isValid()) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid time format. Expected format: HH:mm' };
    return;
  }

  // Check if the appointment date is in the future
  if (moment(date).isBefore(moment().startOf('day'))) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid appointment date. Please select a future date.' };
    return;
  }

  // TODO: cubrir caso de endTime = 00:00
  if (moment(endTime, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid time range. endTime must be after startTime.' };
    return;
  }

  const eventsForTheDay = (
    await getEvents(calendarId, {
      startDate: moment(date).startOf('day'),
      endDate: moment(date).endOf('day'),
    })
  ).filter((event) => {
    return !event.start.date; // Exclude all-day events that only have 'date' and not 'dateTime'
  });

  // Check if the appointment is available (not booked)
  for (const event of eventsForTheDay) {
    const eventStart = moment(event.start.dateTime).format('HH:mm');
    const eventEnd = moment(event.end.dateTime).format('HH:mm');

    if (startTime < eventEnd && endTime > eventStart) {
      ctx.status = 400;
      ctx.body = { error: 'Selected time slot is not available. Please choose a different time.' };
      return;
    }
  }

  // Save in Google Calendar
  const event = await createEvent(calendarId, {
    date,
    startTime,
    endTime,
    email,
    ...query,
  });

  ctx.body = { message: 'Appointment booked successfully', event };
});

export default router;
