const express = require('express')

const users = require('./users')

const router = express.Router()

router.use('/users', users)
router.get('/health', (req, res) => {
	res.send('OK')
})

module.exports = router
