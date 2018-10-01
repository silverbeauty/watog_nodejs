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

// Get a single room
router.get('/:id',
  UserCtrl.checkAuth, catchError(RoomCtrl.get))

module.exports = router
