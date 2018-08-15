const express = require('express')

const users = require('./users')
const uploads = require('./uploads')

const router = express.Router()

router.use('/users', users)
router.use('/uploads', uploads)

module.exports = router