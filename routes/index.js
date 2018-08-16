const express = require('express')

const users = require('./users')
const category = require('./category')
const upload = require('./upload')

const router = express.Router()

router.get('/health', (req, res) => {
  res.send('OK')
})

router.use('/users', users)
router.use('/category', category)
router.use('/upload', upload)

module.exports = router
