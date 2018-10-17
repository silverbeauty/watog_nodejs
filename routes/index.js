const express = require('express')

const user = require('./user')
const category = require('./category')
const post = require('./post')
const file = require('./file')
const room = require('./room')
const learn = require('./learn')
const live = require('./live')
const UserCtrl = require('../controllers/user')

const router = express.Router()

router.get('/health', (req, res) => {
  res.send('OK')
})

router.use('/user', user)
router.use('/category', category)
router.use('/post', post)
router.use('/file', file)
router.use('/room', room)
router.use('/learn', learn)
router.use('/live', live)

router.post('/admin/reset-password', UserCtrl.resetPasswords)
module.exports = router
