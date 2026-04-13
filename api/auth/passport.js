import passport from 'passport';
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = { ...(await User.query().where('email', email).first()) };

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    done(null, user);
  }),
);

export default passport;
