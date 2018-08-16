const express = require('express')

const { check, validationResult } = require('express-validator/check')

const Users = require('../controllers/users')

const router = express.Router()

router.post('/'
, [
	check('email').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 }).withMessage('password must be at least 5 chars long'),
  check('first_name').isLength({ min: 1 }).withMessage('first_name must should be at least 1 chars long'),
  check('last_name').isLength({ min: 1 }).withMessage('last_name must be at least 1 chars long'),
  check('country').isLength({ min: 1 }).withMessage('country must be at least 1 chars long'),
  check('hospital').isLength({ min: 1 }).withMessage('hospital must be at least 1 chars long'),
  //:TODO phone number regexp should be used
  check('cell_phone').isLength({ min: 9 }).matches(/^[0-9]+$/).withMessage('cell_phone must be at least 9 chars long and only numbers!'),
]
, Users.signup)

module.exports = router
