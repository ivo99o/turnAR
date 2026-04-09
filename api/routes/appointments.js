import Router from '@koa/router';
import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';
import generateSchedule, {
  generateDefaultSlots,
  getGoogleCalendarEvents,
} from '../services/schedules.js';
import { createEvent } from '../services/events.js';

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

  // Check if the appointment date is in the future

  // Check if the appointment is available (not booked)

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
