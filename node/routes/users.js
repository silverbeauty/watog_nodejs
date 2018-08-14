const express = require('express')

const Users = require('../controllers/users')

const router = express.Router()

router.post('/', Users.signup)

module.exports = router
