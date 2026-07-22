const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const passport = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validate } = require('../middleware/validators');

// Public routes

// Login routes
router.post('/login/super-admin', 
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.loginSuperAdmin
);

router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.loginUser
);

// Google OAuth
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// Password reset
router.post('/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    validate
  ],
  authController.forgotPassword
);

router.post('/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validate
  ],
  authController.resetPassword
);

// Token refresh
router.post('/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    validate
  ],
  authController.refreshToken
);

// Protected routes
router.use(passport.authenticate('jwt', { session: false }));

// Profile
router.get('/profile', authController.getProfile);
router.put('/profile',
  [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    validate
  ],
  authController.updateProfile
);

router.post('/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validate
  ],
  authController.changePassword
);

router.post('/logout', authController.logout);

module.exports = router;
