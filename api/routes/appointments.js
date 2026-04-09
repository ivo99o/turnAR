import Router from '@koa/router';
import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';
import generateSchedule, {
  generateDefaultSlots,
  getGoogleCalendarEvents,
} from '../services/schedules.js';

const router = new Router({
  prefix: '/appointments',
});

router.get('/:userId/appointments-schedule', async (ctx) => {
  const { userId } = ctx.params;
  const { limitDaysAhead, appointmentDuration } = ctx.query;

  // const user = await User.query().findById(userId).first();

  let calendars = await CalendarConnection.query()
    .where('user_id', userId)
    .where('is_active', true);

  // remove duplicates from calendars (if any) using lodash _
  if (calendars.length > 1) {
    throw new Error(
      'Multiple active calendar connections found for user. Please ensure only one active calendar connection exists.',
    );
  }

  const calendar = calendars[0];

  const defaultSlots = generateDefaultSlots({ appointmentDuration });
  const calendarEventsByDate = await getGoogleCalendarEvents(calendar.id, { limitDaysAhead });
  const schedule = generateSchedule(defaultSlots, calendarEventsByDate, limitDaysAhead);

  ctx.body = schedule;
});

export default router;
