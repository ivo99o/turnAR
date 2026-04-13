import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

export function sign(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verify(token) {
  return jwt.verify(token, JWT_SECRET);
}
