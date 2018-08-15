const express = require('express')

const Uploads = require('../controllers/uploads')

const router = express.Router()

router.post('/', Uploads.fileupload)

module.exports = router