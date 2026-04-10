import CalendarConnection from '../models/CalendarConnection.js';
import _ from 'lodash';

const createCalendarConnection = async (data) => {
  if (!data) {
    throw new Error('Request data is missing');
  }

  let {
    user_id,
    access_token,
    refresh_token,
    token_type,
    scope,
    expiry_date,
    google_account_id,
    email,
    status = 'pending',
  } = data;

  // Basic validation
  if (
    _.isNull(user_id) ||
    _.isNull(access_token) ||
    _.isNull(refresh_token) ||
    _.isNull(token_type) ||
    _.isNull(scope) ||
    _.isNull(expiry_date) ||
    _.isNull(google_account_id) ||
    _.isNull(email)
  ) {
    throw new Error('Missing required fields');
  }

  const newConnection = await CalendarConnection.query().insert({
    user_id,
    access_token,
    refresh_token,
    token_type,
    scope,
    expiry_date,
    google_account_id,
    email,
    status,
  });

  return newConnection;
};

const updateCalendarConnection = async (id, data) => {
  if (!id) {
    throw new Error('Calendar connection ID is required');
  }

  const updatedConnection = await CalendarConnection.query()
    .findById(id)
    .patch(data)
    .returning('*');

  if (!updatedConnection) {
    throw new Error('Calendar connection not found');
  }

  return updatedConnection;
};

export { createCalendarConnection, updateCalendarConnection };
