const bcrypt = require('bcryptjs');
const passport = require('../middleware/auth');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');
const config = require('../config');
const logger = require('../utils/logger');

class AuthController {
  async loginSuperAdmin(req, res, next) {
    passport.authenticate('local-super-admin', { session: false }, async (err, admin, info) => {
      if (err) return next(err);
      if (!admin) {
        return res.status(401).json({ error: info?.message || 'Authentication failed' });
      }

      const token = generateToken({ id: admin.id, role: 'super_admin' });
      const refreshToken = generateRefreshToken({ id: admin.id, role: 'super_admin' });

      logger.info(`Super admin logged in: ${admin.username}`);

      res.json({
        success: true,
        data: {
          user: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            fullName: admin.full_name,
            role: 'super_admin',
            isSuperAdmin: true
          },
          token,
          refreshToken
        }
      });
    })(req, res, next);
  }

  async loginUser(req, res, next) {
    passport.authenticate('local-user', { session: false }, async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Authentication failed' });
      }

      // Get user's branch access
      const branchAccess = await User.getUserBranches(user.id);

      const token = generateToken({ id: user.id, role: user.user_role });
      const refreshToken = generateRefreshToken({ id: user.id, role: user.user_role });

      logger.info(`User logged in: ${user.username}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.user_role,
            primaryBranchId: user.primary_branch_id,
            branchAccess
          },
          token,
          refreshToken
        }
      });
    })(req, res, next);
  }

  async googleAuth(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  async googleCallback(req, res, next) {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.redirect(`${config.frontendUrl}/login?error=google_auth_failed`);
      }

      const token = generateToken({ 
        id: user.id, 
        role: user.isSuperAdmin ? 'super_admin' : user.user_role 
      });

      res.redirect(`${config.frontendUrl}/auth/callback?token=${token}`);
    })(req, res, next);
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const decoded = require('../utils/jwt').verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      const newToken = generateToken({ id: decoded.id, role: decoded.role });
      
      res.json({
        success: true,
        data: { token: newToken }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = req.user;

      if (user.isSuperAdmin) {
        return res.json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.full_name,
            role: 'super_admin',
            isSuperAdmin: true
          }
        });
      }

      const branchAccess = await User.getUserBranches(user.id);

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.user_role,
          primaryBranchId: user.primary_branch_id,
          branchAccess
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { email, username } = req.body;
      const user = req.user;

      const updates = {};
      if (email) updates.email = email;
      if (username) updates.username = username;

      const model = user.isSuperAdmin ? SuperAdmin : User;
      const updated = await model.update(user.id, updates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      const model = user.isSuperAdmin ? SuperAdmin : User;
      const currentUser = await model.findById(user.id);

      const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await model.updatePassword(user.id, passwordHash);

      logger.info(`Password changed for user: ${user.id}`);

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.json({ success: true, message: 'If email exists, reset link has been sent' });
      }

      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await User.setPasswordResetToken(user.id, resetToken, expires);

      // TODO: Send email with reset link
      // const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;

      logger.info(`Password reset requested for: ${email}`);

      res.json({ success: true, message: 'If email exists, reset link has been sent' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.id, passwordHash);

      logger.info(`Password reset completed for: ${user.email}`);

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
