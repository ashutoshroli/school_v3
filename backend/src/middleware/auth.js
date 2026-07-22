const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');
const logger = require('../utils/logger');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    if (payload.role === 'super_admin') {
      const admin = await SuperAdmin.findById(payload.id);
      if (admin && admin.is_active) {
        return done(null, { ...admin, isSuperAdmin: true });
      }
    } else {
      const user = await User.findById(payload.id);
      if (user && user.is_active) {
        return done(null, user);
      }
    }
    return done(null, false);
  } catch (error) {
    logger.error('JWT Strategy error:', error);
    return done(error, false);
  }
}));

// Local Strategy for Super Admin
passport.use('local-super-admin', new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const admin = await SuperAdmin.findByUsername(username) || 
                    await SuperAdmin.findByEmail(username);
      
      if (!admin) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (!admin.is_active) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
        return done(null, false, { message: 'Account is temporarily locked' });
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        const newAttempts = (admin.login_attempts || 0) + 1;
        if (newAttempts >= 5) {
          const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
          await SuperAdmin.updateLoginAttempt(admin.id, newAttempts, lockedUntil);
          return done(null, false, { message: 'Account locked due to too many attempts' });
        }
        await SuperAdmin.updateLoginAttempt(admin.id, newAttempts);
        return done(null, false, { message: 'Invalid credentials' });
      }

      await SuperAdmin.resetLoginAttempts(admin.id);
      return done(null, { ...admin, isSuperAdmin: true });
    } catch (error) {
      logger.error('Local Strategy error:', error);
      return done(error);
    }
  }
));

// Local Strategy for Regular Users
passport.use('local-user', new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await User.findByUsername(username) || 
                   await User.findByEmail(username);
      
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (!user.is_active) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return done(null, false, { message: 'Account is temporarily locked' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        const newAttempts = (user.login_attempts || 0) + 1;
        if (newAttempts >= 5) {
          const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
          await User.updateLoginAttempt(user.id, newAttempts, lockedUntil);
          return done(null, false, { message: 'Account locked due to too many attempts' });
        }
        await User.updateLoginAttempt(user.id, newAttempts);
        return done(null, false, { message: 'Invalid credentials' });
      }

      await User.resetLoginAttempts(user.id);
      return done(null, user);
    } catch (error) {
      logger.error('Local Strategy error:', error);
      return done(error);
    }
  }
));

// Google OAuth Strategy
if (config.google.clientId && config.google.clientSecret) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackUrl,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check for Super Admin first
      let user = await SuperAdmin.findByGoogleId(profile.id);
      if (user) {
        return done(null, { ...user, isSuperAdmin: true });
      }

      // Check for regular user
      user = await User.findByGoogleId(profile.id);
      if (user) {
        return done(null, user);
      }

      // Check if email exists
      const email = profile.emails[0].value;
      user = await User.findByEmail(email);
      if (user) {
        await User.update(user.id, { googleId: profile.id, googleEmail: email });
        return done(null, user);
      }

      // User not found
      return done(null, false, { message: 'No account found with this Google account' });
    } catch (error) {
      logger.error('Google Strategy error:', error);
      return done(error);
    }
  }));
}

module.exports = passport;
