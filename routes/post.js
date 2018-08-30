const express = require('express')

const { body, query } = require('express-validator/check')

const PostCtrl = require('../controllers/post')
const UserCtrl = require('../controllers/user')

const router = express.Router()

// TODO: should check parameters here
router.post('/', UserCtrl.checkAuth, [
  body('category_id').isDecimal(),
  body('picture').isString(),
  body('description').optional().isString()
], PostCtrl.create)

// Create a new vote
router.post('/:id/vote', UserCtrl.checkAuth, [ body('commend').isBoolean() ], PostCtrl.load, PostCtrl.vote)

// Create a new report about a post
router.post('/:id/report', UserCtrl.checkAuth, [
  body('type').isIn(['spam', 'violence', 'sex', 'other'])
], PostCtrl.load, PostCtrl.report)

// Count post
router.get('/count', UserCtrl.checkAuth, PostCtrl.count)

// Get a single post
router.get('/:id', UserCtrl.checkAuth, PostCtrl.load, PostCtrl.get)

// Remove a single post
router.delete('/:id', UserCtrl.checkAuth, PostCtrl.load, PostCtrl.remove)

// Query post
router.get('/', UserCtrl.checkAuth, [
  query('direction').optional().isIn(['DESC', 'ASC']).withMessage('direction must be DESC or ASC'),
  query('order').optional().isIn(['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']).withMessage(`order must be one of 'vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt'`)
], PostCtrl.query)

module.exports = router
