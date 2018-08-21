
const { validationResult } = require('express-validator/check')

const Post = require('../models/post')
const Category = require('../models/category')
const Vote = require('../models/post')

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
      error: 'no category exists:' + category_id
    })
  }

  const post = Post.build({
    ...req.body,
    user_id: req.currentUser.id
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
  res.send({
    status: true,
    data: post.get({ plain: true})
  })
}

const query = async (req, res) => {
  // TODO: query condition should be defined in route
  // TODO: limit access to users
  const allowed_queries = ['limit', 'offset', 'category_id', 'user_id']
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

  // Remove offset, limit
  delete query.limit
  delete query.offset

  const data = await Post.findAll({
    where: query,
    limit,
    offset,
    raw: true
  })

  res.send({
    status: true,
    data
  })
}

const load = async (req, res, next) => {
  const { id } = req.params
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
}

const vote = async (req, res) => {
  const { post, currentUser } = req
  
  // Check if already voted
  const vote = Vote.findOne({
    where: {
      post_id: post.id,
      user_id: currentUser.id
    }
  })

  if (vote) {
    return res.send({
      status: false,
      error: 'already_voted'
    })
  }

  const newVote = new Vote({
    post_id: post.id,
    user_id: currentUser.id,
    category_id: post.category_id
  })

  await newVote.save()
  
// TODO: load all votes
// TODO: load all voters

  

  const data = post.get({
    plain: true
  })

  res.send({
    status: true,
    data
  })
}

module.exports = {
  create,
  load,
  get,
  query
}
