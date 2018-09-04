const express = require('express')

const { body, validationResult } = require('express-validator/check')

const CategoryCtrl = require('../controllers/category')
const UserCtrl = require('../controllers/user')
const { catchError } = require('../controllers/error')

const router = express.Router()

// Create a new cateogry
router.post('/',
  UserCtrl.checkAuth, [
    body('type').isLength({ min: 3 }).withMessage('type must be at least 3 chars long'),
    body('description').optional().isString(),
    body('picture').optional().isString(),
    body('score_ratio').optional().isString()
  ], catchError(CategoryCtrl.create))

// Get a single category
router.get('/:id', UserCtrl.checkAuth, catchError(CategoryCtrl.get))

// Get a single category
router.get('/', UserCtrl.checkAuth, catchError(CategoryCtrl.query))

module.exports = router
