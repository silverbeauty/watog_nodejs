const express = require('express')
const { check, validationResult } = require('express-validator/check')

const FileCtrl = require('../controllers/file')
const Users = require('../controllers/user')

const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: 'files/' })


// Upload verification document: Diploma, student cardm ...
router.post('/verify', Users.checkAuth, upload.single('file'), FileCtrl.uploadVerifyDoc)

// Upload a file
router.post('/', Users.checkAuth, upload.single('file'), FileCtrl.create)

// Get a file
router.get('/:id', FileCtrl.get)

module.exports = router
