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
    body('score_ratio').optional().isDecimal()
  ], catchError(CategoryCtrl.create))

// Get a single category
router.get('/:id', UserCtrl.checkAuth, catchError(CategoryCtrl.get))

// Vote a single category
router.post('/:id/vote', UserCtrl.checkAuth, catchError(CategoryCtrl.vote))

// Cancel Vote a single category
router.post('/:id/vote/cancel', UserCtrl.checkAuth, catchError(CategoryCtrl.cancelVote))

// Get a single category
router.get('/', UserCtrl.checkAuth, catchError(CategoryCtrl.query))

module.exports = router
