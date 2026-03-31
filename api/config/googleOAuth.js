import { google } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from './index.js';

export const createOAuthClient = () =>
  new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
