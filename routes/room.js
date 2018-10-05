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

// Get messages
router.get('/:id/messages',
  UserCtrl.checkAuth, catchError(RoomCtrl.getMessages))

// Add Member to room
router.post('/:id/member',
  UserCtrl.checkAuth, catchError(RoomCtrl.addMember))

// Report a room
router.post('/:id/report',
  UserCtrl.checkAuth, catchError(RoomCtrl.report))

// Leave a room
router.post('/:id/leave',
  UserCtrl.checkAuth, catchError(RoomCtrl.leave))

// Join a room
router.post('/:id/join',
  UserCtrl.checkAuth, catchError(RoomCtrl.join))

// Query my rooms
router.get('/my',
  UserCtrl.checkAuth, catchError(RoomCtrl.queryMyRooms))

// Get a single room
router.get('/:id',
  UserCtrl.checkAuth, catchError(RoomCtrl.get))

// Edit a single room
router.put('/:id',
  UserCtrl.checkAuth, catchError(RoomCtrl.edit))

// Query rooms
router.get('/',
  UserCtrl.checkAuth, catchError(RoomCtrl.query))

module.exports = router
