const express = require('express')

const user = require('./user')
const category = require('./category')
const post = require('./post')
const file = require('./file')
const room = require('./room')
const learn = require('./learn')

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
router.get('/live', (req, res) => {
	// https://www.googleapis.com/youtube/v3/playlists?channelId=UCL_KG4bwo7BsbU50jV_wNgg&part=snippet&key=AIzaSyAznLC1F29sn09_-gW-7E-i22a_U0r2I2g
	res.send({
		status: true,
		data: {
			youtube_id: 'zp4jxwg5xsQ'
		}
	})
})

module.exports = router
