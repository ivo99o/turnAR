import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
// import { Home, Calendar, Users, FileText, Settings } from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Home', icon: 'A' },
  { path: '/schedule', label: 'Schedule', icon: 'A' },
  { path: '/users', label: 'Users', icon: 'A' },
  { path: '/reports', label: 'Reports', icon: 'A' },
  { path: '/settings', label: 'Settings', icon: 'A' },
];

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
`;

const Sidebar = styled.aside`
  width: 16rem;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 1rem;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition:
    background-color 0.2s,
    color 0.2s;
  background-color: ${(props) => (props.isActive ? '#eff6ff' : 'transparent')};
  color: ${(props) => (props.isActive ? '#2563eb' : '#374151')};
  &:hover {
    background-color: ${(props) => (props.isActive ? '#eff6ff' : '#f3f4f6')};
  }
  span {
    font-weight: 500;
  }
`;

const Main = styled.main`
  flex: 1;
  overflow: auto;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
`;

const LogoutButton = styled.button`
  color: #ff0055;
  background: transparent;
  border: none;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #cc0000;
  }
`;

const UserInfo = styled.div``;

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  console.log(user);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <Title>Appointments Admin</Title>
        </SidebarHeader>
        <Nav>
          <NavList>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavItem key={item.path}>
                  <NavLink to={item.path} isActive={isActive}>
                    <div>{item.icon}</div>
                    <span>{item.label}</span>
                  </NavLink>
                </NavItem>
              );
            })}
          </NavList>
        </Nav>
        <Footer>
          <UserInfo>{user?.name || 'User'}</UserInfo>
          <LogoutButton onClick={logout}>Log out</LogoutButton>
        </Footer>
      </Sidebar>
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}
