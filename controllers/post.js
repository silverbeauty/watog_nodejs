
const { validationResult } = require('express-validator/check')
const Sequelize = require('sequelize')

const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
const Vote = require('../models/vote')
const Report = require('../models/report')

const Op = Sequelize.Op

// Common user fields
const userFields = ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'user_name', 'country']

const calculateVote = async (req, post) => {
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
  post.vote_score = (upVotes.length - downVotes.length) * post.Category.score_ratio

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
      user_id: post.user_id,
      banned: {
        [Op.not]: true
      }
    }
  })

  // TODO: calculate user vote score
  const down_vote_count = await Post.sum('down_vote_count', {
    where: {
      user_id: post.user_id,
      banned: {
        [Op.not]: true
      }
    }
  })

  const vote_score = await Post.sum('vote_score', {
    where: {
      user_id: post.user_id,
      banned: {
        [Op.not]: true
      }
    }
  })

  user.up_vote_count = up_vote_count || 0
  user.down_vote_count = down_vote_count || 0
  user.vote_score = vote_score || 0

  await user.save()

    // count
  data.category_vote_count = await Vote.count({
    where: {
      user_id: req.currentUser.id,
      category_id: post.category_id,
      post_id: {
        [Op.not]: null
      }
    }
  })

  return data
}

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

  // TODO: check if another post is submitted for the same category.
  const prevPost = await Post.findOne({
    where: {
      category_id,
      user_id: req.currentUser.id
    }
  })

  if (prevPost) {
    return res.status(400).send({
      status: false,
      error: 'already_posted_category'
    })
  }

  const post = new Post({
    ...req.body,
    user_id: req.currentUser.id,
    up_vote_count: 0,
    down_vote_count: 0,
    vote_score: 0,
    report_count: 0
  })
  const data = await post.save()

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

  // Calculate Rank
  const rank = await Post.count({
    where: {
      vote_score: {
        [Op.gt]: data.vote_score
      }
    }
  })

  data.rank = rank + 1

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

  query.banned = {
    [Op.not]: true
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
  const allowed_queries = [
    'limit',
    'offset',
    'category_id',
    'user_id',
    'order',
    'direction',
    'random',
    'country',
    'vote',
    'keyword',
    'createdAt',
    'updatedAt',
    'cfrom',
    'cto'
  ]
  const query = {...req.query}
  const cquery = {...query}
  const { country } = query

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

  if (query.keyword) {
    query.description = {
      [Op.like]: '%' + query.keyword + '%'
    }
  }

  if (query.cfrom || query.cto) {
    console.info('Post Query:', query.cfrom, new Date(query.cfrom))

    query.createdAt = {}
    if (query.cfrom) {
      query.createdAt[Op.gte] = query.cfrom
    }

    if (query.cto) {
      query.createdAt[Op.lte] = query.cto
    }
  }

  query.banned = {
    [Op.not]: true
  }

  if (typeof query.createdAt === 'string') { query.createdAt = new Date(query.createdAt) }
  if (typeof query.updatedAt === 'string') { query.updatedAt = new Date(query.updatedAt) }

  // remove non field queries
  delete query.limit
  delete query.offset
  delete query.order
  delete query.direction
  delete query.random
  delete query.country
  delete query.vote
  delete query.keyword
  delete query.cfrom
  delete query.cto

  let sQuery
  if (country) {
    sQuery = {
      where: query,
      limit,
      offset,
      include: [{
        model: User,
        attributes: userFields,
        where: {
          country
        }
      }, { model: Vote }]
    }
  } else {
    sQuery = {
      where: query,
      limit,
      offset,
      include: [{
        model: User,
        attributes: userFields
      }, { model: Vote }/*, { model: Report, attributes: [ 'id'] } */ ]
    }
  }

  if (order && !isRandom) {
    sQuery.order = [[order, direction]]
  } else if (isRandom) {
    sQuery.order = [Sequelize.fn('RANDOM')]
  }

  const data = await Post.findAll(sQuery)

  const allPosts = await Post.findAll({
    attributes: ['vote_score']
  })

  const ranks = allPosts.map((p) => p.vote_score).sort((a, b) => (b - a))
  const rankData = data.map(p => {
    const index = ranks.findIndex(r => r <= p.vote_score)
    const post = p.get({plain: true})
    post.rank = index + 1
    return post
  })

  res.send({
    status: true,
    data: rankData
  })
}

const load = async (req, res, next) => {
  const { id } = req.params
  try {
    const post = await Post.findOne({
      where: {
        id
      },
      include: [{
        model: Category
      }, {
        model: User,
        attributes: ['id', 'first_name', 'last_name']
      }]
    })
    if (post) {
      req.post = post
      next()
    } else {
      res.status(400).send({
        status: false,
        error: 'no_post'
      })
    }
  } catch (e) {
    console.error('Failed to load post:', e)
    res.status(500).send({
      status: false,
      error: 'internal_server_error'
    })
  }
}

const vote = async (req, res) => {
  const { post, currentUser } = req
  let { commend } = req.body

  if (post.user_id === currentUser.id) {
    return res.status(400).send({
      status: false,
      error: 'self_post'
    })
  }

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

  if (vote) {
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

  const data = await calculateVote(req, post)

  res.send({
    status: true,
    data
  })
}

const cancelVote = async (req, res) => {
  const { post, currentUser } = req

  // Check if already voted
  const vote = await Vote.findOne({
    where: {
      post_id: post.id,
      user_id: currentUser.id
    }
  })

  if (!vote) {
    return res.status(400).send({
      status: false,
      error: 'no_vote'
    })
  }

  await vote.destroy()

  const data = await calculateVote(req, post)

  res.send({
    status: true,
    data
  })
}

const report = async (req, res) => {
  const { post } = req

  const prevReport = await Report.findOne({
    where: {
      post_id: post.id,
      user_id: req.currentUser.id
    }
  })

  if (prevReport) {
    return res.status(400).send({
      status: false,
      error: 'already_reported'
    })
  }

  const report = new Report({
    post_id: post.id,
    type: req.body.type,
    user_id: req.currentUser.id,
    description: req.body.description
  })
  await report.save()

  // Update report count
  const count = await Report.count({
    where: {
      post_id: req.post.id
    }
  })

  post.report_count = count

  if (count >= 3) { // If reported count is bigger than 3: ban the post
    post.banned = true
  }

  await post.save()

  // Update user report count
  const report_count = await Report.count({
    include: [{
      model: Post,
      attributes: ['id', 'user_id'],
      where: {
        user_id: post.user_id
      }
    }]
  })

  console.info('Total Report Count:', report_count)

  await User.update({
    report_count
  }, {
    where: {
      id: post.user_id
    }
  })

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

  await post.destroy()

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
  cancelVote,
  report,
  count,
  remove
}
