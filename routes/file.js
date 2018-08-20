const express = require('express')

const { check, validationResult } = require('express-validator/check')

const FileCtrl = require('../controllers/file')

const multer = require('multer')

const router = express.Router()

router.post('/', FileCtrl.create)

module.exports = router
