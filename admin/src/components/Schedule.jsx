import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import styled from 'styled-components';
import { Page, PageHeader, PageTitle, PageSubTitle } from './UI/Page';
import { Card } from './UI/Card';

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

const calendars = [
  {
    id: 1,
    name: 'Dr. Sarah Williams',
    color: 'blue',
    appointments: [
      { id: 1, time: '10:00 AM', patient: 'John Smith', duration: '30 min', type: 'Consultation' },
      { id: 2, time: '2:00 PM', patient: 'Michael Brown', duration: '60 min', type: 'Treatment' },
    ],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    color: 'purple',
    appointments: [
      { id: 3, time: '11:00 AM', patient: 'Sarah Johnson', duration: '45 min', type: 'Follow-up' },
      { id: 4, time: '3:00 PM', patient: 'Emily Davis', duration: '30 min', type: 'Consultation' },
    ],
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    color: 'green',
    appointments: [
      { id: 5, time: '9:00 AM', patient: 'Robert Taylor', duration: '30 min', type: 'Check-up' },
      { id: 6, time: '1:00 PM', patient: 'Lisa Martinez', duration: '45 min', type: 'Follow-up' },
    ],
  },
  {
    id: 4,
    name: 'Dr. Lisa Anderson',
    color: 'orange',
    appointments: [
      { id: 7, time: '10:00 AM', patient: 'David White', duration: '60 min', type: 'Treatment' },
      { id: 8, time: '4:00 PM', patient: 'Anna Clark', duration: '30 min', type: 'Consultation' },
    ],
  },
];

const getColorStyles = (color) => {
  const colors = {
    blue: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      hover: '#dbeafe',
      badge: '#2563eb',
    },
    purple: {
      bg: '#faf5ff',
      border: '#d8b4fe',
      hover: '#f3e8ff',
      badge: '#9333ea',
    },
    green: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      hover: '#dcfce7',
      badge: '#16a34a',
    },
    orange: {
      bg: '#fff7ed',
      border: '#fed7aa',
      hover: '#ffedd5',
      badge: '#ea580c',
    },
  };
  return colors[color] || colors.blue;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HeaderSection = styled.div`
  padding: 2rem;
  padding-bottom: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
`;

const NewAppointmentButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const CalendarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border-color: transparent;
  background-color: transparent;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f3f4f6;
  }
`;

const DateTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const ScheduleGrid = styled.div`
  flex: 1;
  padding: 0 2rem 2rem;
  overflow: hidden;
`;

const GridContainer = styled.div`
  background-color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  height: 100%;
  overflow-x: auto;
`;

const Grid = styled.div`
  min-width: max-content;
  height: 100%;
  display: flex;
`;

const TimeColumn = styled.div`
  width: 6rem;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

const TimeSlot = styled.div`
  height: 6rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
`;

const TimeText = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const CalendarColumn = styled.div`
  width: 20rem;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
`;

const CalendarHeaderCell = styled.div`
  height: 4rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  background-color: #f9fafb;
`;

const CalendarName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ColorDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${(props) => getColorStyles(props.color).badge};
`;

const SlotCell = styled.div`
  height: 6rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem;
`;

const AppointmentCard = styled.div`
  background-color: ${(props) => getColorStyles(props.color).bg};
  border: 1px solid ${(props) => getColorStyles(props.color).border};
  border-radius: 0.5rem;
  padding: 0.75rem;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  &:hover {
    background-color: ${(props) => getColorStyles(props.color).hover};
  }
`;

const PatientName = styled.p`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  margin: 0;
`;

const AppointmentType = styled.p`
  font-size: 0.75rem;
  color: #4b5563;
  margin: 0.25rem 0 0 0;
`;

const Duration = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: auto 0 0 0;
`;

const AvailableSlot = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  height: 100%;
  transition: border-color 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-color: #d1d5db;
  }
`;

const AvailableText = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export function Schedule() {
  return (
    <Container>
      <HeaderSection>
        <HeaderContent>
          <div>
            <Title>Schedule</Title>
            <Subtitle>Manage appointments across all calendars</Subtitle>
          </div>
          <NewAppointmentButton>
            <Plus className="w-5 h-5" />
            New Appointment
          </NewAppointmentButton>
        </HeaderContent>

        <CalendarContainer>
          <CalendarHeader>
            <DateNavigation>
              <NavButton>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </NavButton>
              <DateTitle>Monday, April 21, 2026</DateTitle>
              <NavButton>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </NavButton>
            </DateNavigation>
          </CalendarHeader>
        </CalendarContainer>
      </HeaderSection>

      <ScheduleGrid>
        <GridContainer>
          <Grid>
            <TimeColumn>
              <div style={{ height: '4rem', borderBottom: '1px solid #e5e7eb' }}></div>
              {timeSlots.map((slot) => (
                <TimeSlot key={slot}>
                  <TimeText>{slot}</TimeText>
                </TimeSlot>
              ))}
            </TimeColumn>

            {calendars.map((calendar) => (
              <CalendarColumn key={calendar.id}>
                <CalendarHeaderCell>
                  <CalendarName>
                    <ColorDot color={calendar.color} />
                    <span style={{ fontWeight: 600, color: '#111827' }}>{calendar.name}</span>
                  </CalendarName>
                </CalendarHeaderCell>

                {timeSlots.map((slot) => {
                  const appointment = calendar.appointments.find((apt) => apt.time === slot);

                  return (
                    <SlotCell key={slot}>
                      {appointment ? (
                        <AppointmentCard color={calendar.color}>
                          <PatientName>{appointment.patient}</PatientName>
                          <AppointmentType>{appointment.type}</AppointmentType>
                          <Duration>{appointment.duration}</Duration>
                        </AppointmentCard>
                      ) : (
                        <AvailableSlot>
                          <AvailableText>Available</AvailableText>
                        </AvailableSlot>
                      )}
                    </SlotCell>
                  );
                })}
              </CalendarColumn>
            ))}
          </Grid>
        </GridContainer>
      </ScheduleGrid>
    </Container>
  );
}
