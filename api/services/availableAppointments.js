const getAvailableAppointments = async (calendarId, date) => {
  try {
    // Get calendarConnection from a query based on userId

    return response.data.items || [];
  } catch (error) {
    throw new Error(`Error fetching available appointments: ${error.message}`);
  }
};

module.exports = {
  getAvailableAppointments,
};
