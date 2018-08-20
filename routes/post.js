const express = require('express')

const { check, validationResult } = require('express-validator/check')

const PostCtrl = require('../controllers/post')
const UserCtrl = require('../controllers/user')

const router = express.Router()

// TODO: should check parameters here
router.post('/', UserCtrl.checkAuth, PostCtrl.create)

module.exports = router
