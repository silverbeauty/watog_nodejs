const express = require('express')

const users = require('./users')

const router = express.Router()

router.get('/health', (req, res) => {
	res.send('OK')
})

router.use('/users', users)


module.exports = router
