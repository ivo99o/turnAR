import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Button, Container } from './UI/styles';
import { Card } from './UI/Card';
import { Page, PageHeader, PageSubTitle, PageTitle } from './UI/Page';

export function Home() {
  // Set page title on the browser tab

  return (
    <Page backgroundColor="#F9FAFB">
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubTitle>Bienvenido a tu dashboard.</PageSubTitle>
      </PageHeader>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
        <UserCard />
        <UserCard />
      </div>
    </Page>
  );
}

function UserCard() {
  const { request } = useApi();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await request('/home/user', { method: 'GET' });
      setUserData(data);
    };

    fetchUserData();
  }, [request]);

  const handleGoogleCalendarSetup = async () => {
    try {
      const data = await request('/google/auth/link', { method: 'GET' });
      window.location.href = data.url; // Redirect to Google OAuth
    } catch (e) {
      console.error(e);
    }
  };

  if (!userData) return null;

  return (
    <Card>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>{userData.name}</h2>
      <p style={{ color: '#4b5563' }}>{userData.email}</p>
      <p style={{ color: userData.calendarStatus ? '#16a34a' : '#dc2626' }}>
        Calendar: {userData.calendarStatus ? 'Connected' : 'Not Connected'}
      </p>
      {!userData.calendarStatus && (
        <Button bg="#2563eb" hoverBg="#1d4ed8" onClick={handleGoogleCalendarSetup}>
          Connect Calendar
        </Button>
      )}
    </Card>
  );
}

async function WorkspaceCard() {
  // const { workspace } = await request('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify(form),
  // });
}
