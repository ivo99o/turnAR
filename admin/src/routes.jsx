import { createBrowserRouter } from 'react-router-dom';
// import { Users } from './components/Users';
// import { Reports } from './components/Reports';
// import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Schedule } from './components/Schedule';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'schedule', Component: Schedule },
      //   { path: 'users', Component: Users },
      //   { path: 'reports', Component: Reports },
      //   { path: 'settings', Component: Settings },
    ],
  },
]);
