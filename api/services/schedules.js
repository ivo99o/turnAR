import moment from 'moment';
import _ from 'lodash';
import { getEvents } from './events.js';

const DEFAULT_APPOINTMENT_DURATION = 60;
const DEFAULT_LIMIT_DAYS_AHEAD = 7;

const MINUTES_IN_A_DAY = 24 * 60;

const generateSchedule = (
  defaultSlots,
  calendarEventsByDate,
  limitDaysAhead = DEFAULT_LIMIT_DAYS_AHEAD,
) => {
  const today = moment().format('YYYY-MM-DD');

  const schedule = [];

  for (let i = 0; i < limitDaysAhead; i++) {
    let slots = _.cloneDeep(defaultSlots);
    const date = moment(today).add(i, 'days').format('YYYY-MM-DD');

    const eventsForDate = calendarEventsByDate[date] || [];

    for (const event of eventsForDate) {
      const eventStart = moment(event.start.dateTime);
      const eventEnd = moment(event.end.dateTime);

      // Mark slots as booked for the duration of the event
      for (let j = 0; j < slots.length; j++) {
        const toMinutes = (momentTime) => {
          const minutes = momentTime.hours() * 60 + momentTime.minutes();
          return minutes === 0 ? MINUTES_IN_A_DAY : minutes; // 00:00 → 1440
        };

        const slotStartMinutes =
          toMinutes(moment(slots[j].startTime, 'HH:mm')) === MINUTES_IN_A_DAY
            ? 0
            : toMinutes(moment(slots[j].startTime, 'HH:mm')); // Handle 00:00 as 1440 minutes
        const slotEndMinutes = toMinutes(moment(slots[j].endTime, 'HH:mm'));
        const eventStartMinutes =
          toMinutes(moment(eventStart, 'HH:mm')) === MINUTES_IN_A_DAY
            ? 0
            : toMinutes(moment(eventStart, 'HH:mm')); // Handle 00:00 as 1440 minutes
        const eventEndMinutes = toMinutes(moment(eventEnd, 'HH:mm'));

        if (slotStartMinutes < eventEndMinutes && slotEndMinutes > eventStartMinutes) {
          slots[j].isBooked = true;
        }
      }
    }

    schedule.push({ date, slots });
  }

  return schedule;
};

const getGoogleCalendarEvents = async (
  calendarId,
  { limitDaysAhead = DEFAULT_LIMIT_DAYS_AHEAD } = {},
) => {
  // get calendar events
  const calendarEvents = await getEvents(calendarId, {
    startDate: moment(),
    endDate: moment().add(limitDaysAhead, 'days'),
  });

  // Filter all day events
  const filteredCalendarEvents = calendarEvents.filter((event) => {
    return !event.start.date; // Exclude all-day events that only have 'date' and not 'dateTime'
  });

  const calendarEventsByDate = _.groupBy(filteredCalendarEvents, (event) => {
    return moment(event.start.dateTime || event.start.date).format('YYYY-MM-DD');
  });

  return calendarEventsByDate;
};

const generateDefaultSlots = ({ appointmentDuration = DEFAULT_APPOINTMENT_DURATION } = {}) => {
  const numberOfSlotsPerDay = Math.floor(MINUTES_IN_A_DAY / appointmentDuration);
  let defaultSlots = [];

  for (let i = 0; i < numberOfSlotsPerDay; i++) {
    const startTime = moment().startOf('day');

    defaultSlots.push({
      startTime: startTime.add(i * appointmentDuration, 'minutes').format('HH:mm'),
      endTime: startTime.add(appointmentDuration, 'minutes').format('HH:mm'),
      isBooked: false,
    });
  }
  return defaultSlots;
};

export default generateSchedule;
export { generateSchedule, getGoogleCalendarEvents, generateDefaultSlots };
