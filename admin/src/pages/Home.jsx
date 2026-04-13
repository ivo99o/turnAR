import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={logout}>Log out</button>
      <GoogleCalendar />
    </div>
  );
}

function GoogleCalendar() {
  const { request, loading } = useApi();

  const [googleCalendarData, setGoogleCalendarData] = useState(null);

  useEffect(() => {
    // get connection
    const fetchConnection = async () => {
      try {
        const data = await request('/google/connection', { method: 'GET' });
        setGoogleCalendarData(data);
      } catch (e) {
        console.error('Failed to fetch Google Calendar connection:', e);
      }
    };

    fetchConnection();
  }, [request]);

  const handleGoogleCalendarSetup = async () => {
    try {
      const data = await request('/google/auth/link', { method: 'GET' });
      window.location.href = data.url; // Redirect to Google OAuth
    } catch (e) {
      console.error(e);
    }
  };

  const activeConnection = googleCalendarData?.status === 'active';

  return (
    <div>
      <h2>Google Calendar Integration</h2>
      {activeConnection && (
        <div>
          <h3>Google Calendar Connected</h3>
          <p>Email: {googleCalendarData.email}</p>
          <p>Status: {googleCalendarData.status}</p>
        </div>
      )}
      <p>
        {activeConnection
          ? 'You are already connected to your Google Calendar'
          : 'Click to connect to Google Calendar'}
      </p>
      <button onClick={handleGoogleCalendarSetup} disabled={loading || activeConnection}>
        Connect Google Calendar
      </button>
    </div>
  );
}
