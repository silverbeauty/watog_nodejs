const express = require('express')

const { body, validationResult } = require('express-validator/check')

const UserCtrl = require('../controllers/user')
const RoomCtrl = require('../controllers/room')
const { catchError } = require('../controllers/error')

const router = express.Router()

// Create a new cateogry
// TODO: should validate requests
router.post('/',
  UserCtrl.checkAuth, catchError(RoomCtrl.create))

// Get a single category
router.get('/:id', UserCtrl.checkAuth, catchError(CategoryCtrl.get))

// Vote a single category
router.post('/:id/vote', UserCtrl.checkAuth, catchError(CategoryCtrl.vote))

// Cancel Vote a single category
router.post('/:id/vote/cancel', UserCtrl.checkAuth, catchError(CategoryCtrl.cancelVote))

// Get a single category
router.get('/', UserCtrl.checkAuth, catchError(CategoryCtrl.query))

module.exports = router
