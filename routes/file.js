const express = require('express')

const { check, validationResult } = require('express-validator/check')

const FileCtrl = require('../controllers/file')

const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: 'files/' })

router.post('/', upload.single('file'), FileCtrl.create)

module.exports = router
