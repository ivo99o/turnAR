import { useContext } from 'react';
import { AuthContext } from '../context/auth_context.js';

export const useAuth = () => useContext(AuthContext);
