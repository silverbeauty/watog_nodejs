const express = require('express')

const { check, validationResult } = require('express-validator/check')

const Category = require('../controllers/category')

const router = express.Router()

router.post('/'
, [
  // name must be at least 5 chars long
  check('type').isLength({ min: 5 }).withMessage('name must be at least 5 chars long'),
]
, Category.addNew)

module.exports = router
