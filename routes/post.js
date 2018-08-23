const express = require('express')

const { body, check, validationResult } = require('express-validator/check')

const PostCtrl = require('../controllers/post')
const UserCtrl = require('../controllers/user')

const router = express.Router()

// TODO: should check parameters here
router.post('/', UserCtrl.checkAuth, PostCtrl.create)

// Create a new vote
router.post('/:id/vote', UserCtrl.checkAuth, [ body('commend').isBoolean() ], PostCtrl.load, PostCtrl.vote)

// Create a new report about a post
router.post('/:id/report', UserCtrl.checkAuth, [
	body('type').isIn(['spam', 'violence', 'sex', 'other'])
	], PostCtrl.load, PostCtrl.report)

// Get a single post
router.get('/:id', UserCtrl.checkAuth, PostCtrl.load, PostCtrl.get)

// Query post
router.get('/', UserCtrl.checkAuth, PostCtrl.query)

module.exports = router
