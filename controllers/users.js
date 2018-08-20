const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')

const User = require('../models/user')

const signup = async (req, res) => {
 	const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

  const hash = await bcrypt.hash(req.body.password, 8)

  const user = User.build({
    ...req.body,
    password: hash
  })
  let data
  try {
    const res = await user.save()
    data = res.get({plain: true})
    // Remove password
    delete data.password
  } catch (e) {
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

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }

  const { email, password } = req.body

  const _user = await User.findOne({ where: { email } })

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }

  const user = _user.get({plain: true})

  // Check password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }

  // TODO: Include only email for now
  const token = jwt.sign({email}, process.env.JWT_SECRET)

  // prevent user's password to be returned
  delete user.password
  res.send({
    status: true,
    data: {
      token,
      user
    }
  })
}

const checkAuth = async (req, res, next) => {
  const token = req.get('Authorization')
  let decoded
  try {
     decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch(err) {
    console.error(err)
    return res.status(401).send({
      status: false,
      error: 'Invalid Authorization'
    })
    // err
  }

  req.currentUser = await User.findOne({ where: { email: decoded.email } })
  next()
}

const getMe = async (req, res) => {
  const { currentUser } = req
  const profile = currentUser.get({
    plain: true
  })
  delete profile.password
  res.send({
    status: true,
    data: profile
  })
}

const getUser = async (req, res) => {
  // TODO: limit access for fields: https://gitlab.com/watog-app/sql-nodejs/issues/1
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(400).send({
      status: false,
      error: 'No such user with id:' + req.params.id
    })
  }

  const userObj = user.get({
    plain: true
  })

  delete userObj.password
  res.send({
    status: true,
    data: userObj
  })
}

module.exports = {
  signup,
  login,
  checkAuth,
  getMe,
  getUser
}
