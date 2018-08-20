const express = require('express')

const users = require('./users')
const category = require('./category')
const posts = require('./post')

const router = express.Router()

router.get('/health', (req, res) => {
  res.send('OK')
})

router.use('/users', users)
router.use('/category', category)
router.use('/posts', posts)

module.exports = router
