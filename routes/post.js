const express = require('express')

const { body, query } = require('express-validator/check')

const PostCtrl = require('../controllers/post')
const UserCtrl = require('../controllers/user')
const { catchError } = require('../controllers/error')

const router = express.Router()

// TODO: should check parameters here
router.post('/', UserCtrl.checkAuth, [
  body('category_id').isDecimal(),
  body('picture').isString(),
  body('description').optional().isString(),
  body('random').optional().isString()
], catchError(PostCtrl.create))

// Create a new vote
router.post('/:id/vote', UserCtrl.checkAuth, [ body('commend').isBoolean() ], PostCtrl.load, catchError(PostCtrl.vote))

// Cancel a vote
router.post('/:id/vote', UserCtrl.checkAuth, PostCtrl.load, catchError(PostCtrl.cancelVote))

// Create a new report about a post
router.post('/:id/report', UserCtrl.checkAuth, [
  body('type').isIn(['spam', 'violence', 'sex', 'other'])
], PostCtrl.load, catchError(PostCtrl.report))

// Count post
router.get('/count', UserCtrl.checkAuth, catchError(PostCtrl.count))

// Get a single post
router.get('/:id', UserCtrl.checkAuth, PostCtrl.load, catchError(PostCtrl.get))

// Remove a single post
router.delete('/:id', UserCtrl.checkAuth, PostCtrl.load, catchError(PostCtrl.remove))

// Query post
router.get('/', UserCtrl.checkAuth, [
  query('direction').optional().isIn(['DESC', 'ASC']).withMessage('direction must be DESC or ASC'),
  query('order').optional().isIn(['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']).withMessage(`order must be one of 'vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt'`)
], catchError(PostCtrl.query))

module.exports = router
