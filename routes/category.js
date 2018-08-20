const express = require('express')

const { body, validationResult } = require('express-validator/check')

const CategoryCtrl = require('../controllers/category')
const UserCtrl = require('../controllers/user')

const router = express.Router()

// Create a new cateogry
router.post('/',
  UserCtrl.checkAuth,
  [ body('type').isLength({ min: 3 }).withMessage('type must be at least 3 chars long')]
  , CategoryCtrl.create)

// Get a single category
router.get('/:id', UserCtrl.checkAuth, CategoryCtrl.get)

// Get a single category
router.get('/', UserCtrl.checkAuth, CategoryCtrl.query)

module.exports = router
