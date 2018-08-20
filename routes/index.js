const express = require('express')

const user = require('./user')
const category = require('./category')
const post = require('./post')
const file = require('./file')

const router = express.Router()

router.get('/health', (req, res) => {
  res.send('OK')
})

router.use('/user', user)
router.use('/category', category)
router.use('/post', post)
router.use('/file', file)

module.exports = router
