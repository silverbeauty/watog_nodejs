
const { validationResult } = require('express-validator/check')
const Sequelize = require('sequelize')

const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
const Vote = require('../models/vote')
const Report = require('../models/report')

// Common user fields
const userFields = ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'user_name', 'country']

const create = async (req, res) => {
  // console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  // Check valid category

  const { category_id } = req.body
  const category = await Category.findById(category_id)
  if (!category) {
    return res.status(400).send({
      status: false,
      error: 'no_category'
    })
  }

  const post = new Post({
    ...req.body,
    user_id: req.currentUser.id,
    up_vote_count: 0,
    down_vote_count: 0,
    vote_score: 0
  })
  let data
  try {
    const res = await post.save()
    data = res.get({plain: true})
    // Remove password
  } catch (e) {
    console.log(e)
    return res.status(500).send({
      status: false,
      error: e.errors
    })
  }

  res.send({
    status: true,
    data
  })
}

const get = async (req, res) => {
  const { post } = req
  const data = post.get({ plain: true})

  if ('vote' in req.query) { // include vote
    data.downVotes = await Vote.findAll({
      where: {
        post_id: post.id,
        commend: false
      },
      include: [{
        model: User,
        attributes: userFields
      }]
    })

    data.upVotes = await Vote.findAll({
      where: {
        post_id: post.id,
        commend: true
      },
      include: [{
        model: User,
        attributes: userFields
      }]
    })
  }

  if ('category' in req.query) {
    const category = await Category.findById(post.category_id)
    if (category) {
      data.Category = category
    }
  }

  if ('user' in req.query) {
    const user = await User.findById(post.user_id, {
      attributes: ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'country']
    })
    if (user) {
      data.User = user
    }
  }

  res.send({
    status: true,
    data
  })
}

const count = async (req, res) => {
  // TODO: query condition should be defined in route
  // TODO: limit access to users
  const allowed_queries = ['category_id', 'user_id']
  const query = {...req.query}
  const cquery = {...query}

  // Check valid queries
  for (let key of allowed_queries) {
    delete cquery[key]
  }

  if (Object.keys(cquery).length > 0) { // Other queries
    console.error('Query not allowed:', cquery)
    return res.status(400).send({
      status: false,
      error: {
        msg: 'Query not allowed',
        data: cquery
      }
    })
  }

  const count_post = await Post.count({
    where: query
  })

  res.send({
    status: true,
    data: {
      count: count_post
    }
  })
}

const query = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  // TODO: query condition should be defined in route
  // TODO: limit access to users
  const allowed_queries = ['limit', 'offset', 'category_id', 'user_id', 'order', 'direction', 'random']
  const query = {...req.query}
  const cquery = {...query}

  // Check valid queries
  for (let key of allowed_queries) {
    delete cquery[key]
  }

  if (Object.keys(cquery).length > 0) { // Other queries
    console.error('Query not allowed:', cquery)
    return res.status(400).send({
      status: false,
      error: {
        msg: 'Query not allowed',
        data: cquery
      }
    })
  }

  const limit = query.limit || 10
  const offset = query.offset || 0
  const order = query.order
  let direction = query.direction
  const isRandom = 'random' in query

  if (!direction) {
    direction = 'DESC'
  }

  // Remove offset, limit
  delete query.limit
  delete query.offset
  delete query.order
  delete query.direction
  delete query.random

  const sQuery = {
    where: query,
    limit,
    offset,
    include: [{
      model: User,
      attributes: userFields
    }/*, { model: Report, attributes: [ 'id'] }*/ ]
  }

  if (order && !isRandom) {
    sQuery.order = [[order, direction]]
  } else if (isRandom) {
    sQuery.order = [Sequelize.fn('RANDOM')]
  }

  const data = await Post.findAll(sQuery)

  res.send({
    status: true,
    data
  })
}

const load = async (req, res, next) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id)
    if (post) {
      req.post = post
      next()
    } else {
      res.send({
        status: false,
        error: 'no_post'
      })
    }
  } catch (e) {
    console.error('Failed to load post:', e)
  }
}

const vote = async (req, res) => {
  const { post, currentUser } = req
  let { commend } = req.body
  if (commend === undefined) { // If commend is not specified: it is true by default
    commend = true
  } else {
    commend = !!commend
  }

  // Check if already voted
  const vote = await Vote.findOne({
    where: {
      post_id: post.id,
      user_id: currentUser.id
    }
  })

  if (vote && vote.commend === commend) {
    return res.send({
      status: false,
      error: 'already_voted'
    })
  } else if (vote) {
    vote.commend = commend
    await vote.save()
  } else {
    const newVote = new Vote({
      post_id: post.id,
      user_id: currentUser.id,
      category_id: post.category_id,
      commend
    })

    await newVote.save()
  }

  const downVotes = await Vote.findAll({
    where: {
      post_id: post.id,
      commend: false
    },
    include: [{
      model: User,
      attributes: userFields
    }]
  })

  const upVotes = await Vote.findAll({
    where: {
      post_id: post.id,
      commend: true
    },
    include: [{
      model: User,
      attributes: userFields
    }]
  })

  // Update upvote, downvote, vote score
  post.up_vote_count = upVotes.length
  post.down_vote_count = downVotes.length
  post.vote_score = upVotes.length - downVotes.length

  await post.save()

  const data = post.get({
    plain: true
  })

  data.downVotes = downVotes.map(v => v.get({plain: true}))
  data.upVotes = upVotes.map(v => v.get({plain: true}))

  // Load User
  const user = await User.findById(post.user_id)

  // TODO: calculate user vote score
  const up_vote_count = await Post.sum('up_vote_count', {
    where: {
      user_id: post.user_id
    }
  })

  // TODO: calculate user vote score
  const down_vote_count = await Post.sum('down_vote_count', {
    where: {
      user_id: post.user_id
    }
  })

  user.up_vote_count = user.up_vote_count || 0
  user.down_vote_count = user.down_vote_count || 0
  user.vote_score = up_vote_count - down_vote_count || 0

  await user.save()

  res.send({
    status: true,
    data
  })
}

const report = async (req, res) => {
  const report = new Report({
    post_id: req.post.id,
    type: req.body.type,
    user_id: req.currentUser.id,
    description: req.body.description
  })
  await report.save()

  res.send({
    status: true,
    data: report
  })
}

const remove = async (req, res) => {
  const { post, currentUser } = req
  if (post.user_id !== currentUser.id) {
    return res.send({
      status: false,
      error: 'invalid_permission'
    })
  }
  try {
    await post.destroy()
  } catch (e) {
    console.error(e)
    return res.status(500).send({
      status: false,
      error: 'internal_error'
    })
  }
  res.send({
    status: true
  })
}

module.exports = {
  create,
  load,
  get,
  query,
  vote,
  report,
  count,
  remove
}
