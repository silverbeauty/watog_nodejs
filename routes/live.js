const express = require('express')

const LiveCtrl = require('../controllers/live')
const UserCtrl = require('../controllers/user')

const router = express.Router()

// Set a live video
router.get('/set', LiveCtrl.set)

// Get a video list
router.get('/', UserCtrl.checkAuth, LiveCtrl.get)

module.exports = router
