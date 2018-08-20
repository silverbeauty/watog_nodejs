const express = require('express')

const { check, validationResult } = require('express-validator/check')

const PostCtrl = require('../controllers/post')

var multer = require('multer')
var fs = require('fs')

const router = express.Router()


router.post('/', PostCtrl.create)

module.exports = router
