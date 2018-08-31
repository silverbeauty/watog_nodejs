const express = require('express')

const { body, query } = require('express-validator/check')

const UserCtrl = require('../controllers/user')
const { catchError } = require('../controllers/error')

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
    body('cell_phone').isLength({ min: 9 }).matches(/^[\+\d]?(?:[\d-.\s()]*)$/).withMessage('cell_phone must be a valid phone number!')
  ]
  , catchError(UserCtrl.signup))

router.post('/login', [
  body('email').isLength({ min: 3 }),
  body('password').isLength({ min: 1 })
], catchError(UserCtrl.login))

// Return own profile
router.put('/me', UserCtrl.checkAuth, catchError(UserCtrl.editMe))

// Return own profile
router.get('/me', UserCtrl.checkAuth, catchError(UserCtrl.getMe))

// Return a single user profile
router.get('/:id', UserCtrl.checkAuth, catchError(UserCtrl.getUser))

// Query users
router.get('/', UserCtrl.checkAuth, [
  query('direction').optional().isIn(['DESC', 'ASC']).withMessage('direction must be DESC or ASC'),
  query('order').optional().isIn(['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']).withMessage(`order must be one of 'vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt'`)
], catchError(UserCtrl.queryUsers))

// Send Verify Email
router.post('/verify/email', UserCtrl.checkAuth, catchError(UserCtrl.sendVerifyEmail))

// Send Verify SMS
router.post('/verify/sms', UserCtrl.checkAuth, catchError(UserCtrl.sendVerifySms))

// Send Verify Email
router.get('/verify/email/:code', catchError(UserCtrl.verifyEmail))

// Send Verify SMS
router.get('/verify/sms/:code', UserCtrl.checkAuth, catchError(UserCtrl.verifySms))

router.post('/forgot-password', catchError(UserCtrl.forgotPassword))
router.post('/new-password', UserCtrl.checkAuth, [ body('old_password').isLength({ min: 5}), body('new_password').isLength({ min: 5 }) ], catchError(UserCtrl.resetPasswordByOld))
router.post('/reset-password/:token', [ body('password').isLength({ min: 5}) ], catchError(UserCtrl.resetPasswordByToken))

// Reset password by code
router.post('/reset-password', [
  body('password').isLength({min: 5}),
  body('email').isEmail(),
  body('code').isLength({ min: 4 })
], catchError(UserCtrl.resetPasswordByCode))

module.exports = router
