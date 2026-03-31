import CalendarConnection from '../models/CalendarConnection.js';

const createCalendarConnection = async (body) => {
  if (!body) {
    throw new Error('Request body is missing');
  }

  let {
    access_token,
    refresh_token,
    token_type,
    scope,
    expiry_date,
    google_account_id,
    email,
    is_active,
  } = body;

  is_active = true; // Ensure new connections are active by default

  // Basic validation
  if (
    !access_token ||
    !refresh_token ||
    !token_type ||
    !scope ||
    !expiry_date ||
    !google_account_id ||
    !email
  ) {
    throw new Error('Missing required fields');
  }

  const newConnection = await CalendarConnection.query().insert({
    access_token,
    refresh_token,
    token_type,
    scope,
    expiry_date,
    google_account_id,
    email,
    is_active,
  });

  return newConnection;
};

export { createCalendarConnection };
