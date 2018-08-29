const express = require('express')

const { body, query } = require('express-validator/check')

const UserCtrl = require('../controllers/user')

const router = express.Router()

router.post('/'
  , [
    body('email').isEmail(),
    body('user_name').isLength({ min: 3 }).withMessage('user_name must be at least 3 chars long'),
    body('job').isLength({ min: 3 }).withMessage('job must be at least 3 chars long'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }).withMessage('password must be at least 5 chars long'),
    body('first_name').isLength({ min: 1 }).withMessage('first_name must should be at least 1 chars long'),
    body('last_name').isLength({ min: 1 }).withMessage('last_name must be at least 1 chars long'),
    body('country').isLength({ min: 1 }).withMessage('country must be at least 1 chars long'),
    body('hospital').isLength({ min: 1 }).withMessage('hospital must be at least 1 chars long'),
    // :TODO phone number regexp should be used
    body('cell_phone').isLength({ min: 9 }).matches(/^[0-9]+$/).withMessage('cell_phone must be at least 9 chars long and only numbers!')
  ]
  , UserCtrl.signup)

router.post('/login', [
  body('email').isLength({ min: 3 }),
  body('password').isLength({ min: 1 })
], UserCtrl.login)

// Return own profile
router.put('/me', UserCtrl.checkAuth, UserCtrl.editMe)

// Return own profile
router.get('/me', UserCtrl.checkAuth, UserCtrl.getMe)

// Return a single user profile
router.get('/:id', UserCtrl.checkAuth, UserCtrl.getUser)

// Query users
router.get('/', UserCtrl.checkAuth, [
  query('direction').optional().isIn(['DESC', 'ASC']).withMessage('direction must be DESC or ASC'),
  query('order').optional().isIn(['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']).withMessage(`order must be one of 'vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt'`)
  ], UserCtrl.queryUsers)

// Send Verify Email
router.post('/verify/email', UserCtrl.checkAuth, UserCtrl.sendVerifyEmail)

// Send Verify SMS
router.post('/verify/sms', UserCtrl.checkAuth, UserCtrl.sendVerifySms)

// Send Verify Email
router.get('/verify/email/:code', UserCtrl.verifyEmail)

// Send Verify SMS
router.get('/verify/sms/:code', UserCtrl.checkAuth, UserCtrl.verifySms)

router.post('/forgot-password', UserCtrl.forgotPassword)
router.post('/new-password', UserCtrl.checkAuth, [ body('old_password').isLength({ min: 5}), body('new_password').isLength({ min: 5 }) ], UserCtrl.resetPasswordByOld)
router.post('/reset-password/:token', [ body('password').isLength({ min: 5}) ], UserCtrl.resetPasswordByToken)

// Reset password by code
router.post('/reset-password', [
  body('password').isLength({min: 5}),
  body('email').isEmail(),
  body('code').isLength({ min: 4 })
], UserCtrl.resetPasswordByCode)

module.exports = router
