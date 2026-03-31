import { Model } from 'objection';

class CalendarConnection extends Model {
  static get tableName() {
    return 'calendar_connections';
  }
}

export default CalendarConnection;
