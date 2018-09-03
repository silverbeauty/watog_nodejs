const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')
const randomstring = require('randomstring')
const Sequelize = require('sequelize')

const User = require('../models/user')
const Post = require('../models/post')
const Verify = require('../models/verify')
const EmailCtrl = require('./email')
const SmsCtrl = require('./sms')

const Op = Sequelize.Op

const signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  const hash = await bcrypt.hash(req.body.password, 8)

  const user = new User({
    ...req.body,
    password: hash,
    settings: `{"notifications":{"vote":true,"participate":true,"spam_mark":true}}` // default setting
  })
  let data
  try {
    const res = await user.save()
    data = res.get({plain: true})
    // Remove password
    delete data.password
  } catch (e) {
    // Remove password
    let errors
    if (e.errors) {
      errors = e.errors.map(err => {
        delete err.instance
        return err
      })
    }

    return res.status(500).send({
      status: false,
      error: errors || e
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

  const _user = await User.findOne({ where: {
    [Op.or]: [{
      email
    }, {
      user_name: email
    }]
  } })

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }

  // Check password
  if (!bcrypt.compareSync(password, _user.password.split(' ')[0])) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }

  // TODO: Include only email for now
  const token = jwt.sign({email}, process.env.JWT_SECRET)

  const user = _user.get({
    plain: true
  })

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
  } catch (err) {
    console.error(err)
    return res.status(401).send({
      status: false,
      error: 'invalid_auth'
    })
    // err
  }

  req.currentUser = await User.findOne({ where: { email: decoded.email } })

  if (req.currentUser) {
    next()
  } else {
    console.error('Valid JWT but no user:', decoded)
    res.send({
      status: false,
      error: 'invalid_user'
    })
  }
}

const checkAuthOptional = async (req, res, next) => {
  const token = req.get('Authorization')
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    next()
    return
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
  // Screen - https://xd.adobe.com/view/ee55407e-335b-4af6-5267-f70e85f9b552-9864/screen/01041a99-bf7b-4e0f-a5b8-9335ee702275/WATOGApp-MyProfil
  // TODO: https://xd.adobe.com/view/ee55407e-335b-4af6-5267-f70e85f9b552-9864/screen/01041a99-bf7b-4e0f-a5b8-9335ee702275/WATOGApp-MyProfil
  // TODO: rank - https://stackoverflow.com/questions/33900750/sequelize-order-by-count-association

  // Calculate Rank
  const rank = await User.count({
    where: {
      vote_score: {
        [Op.gt]: currentUser.vote_score
      }
    }
  })

  profile.vote_rank = rank + 1

  // Find Best Ranked photo
  const good_posts = await Post.findAll({
    where: {
      user_id: currentUser.id
    },
    order: [ 'up_vote_count'],
    limit: 5
  })

  profile.good_posts = good_posts

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
      error: 'no_user'
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

const queryUsers = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  // TODO: query condition should be defined in route
  // TODO: limit access to users
  // TODO: should add sort option
  const allowed_queries = ['limit', 'offset', 'first_name', 'last_name', 'country', 'hospital', 'name', 'order', 'direction']
  const allowed_attributes = ['id', 'first_name', 'last_name', 'country', 'hospital', 'cell_phone', 'picture_profile', 'picture_cover', 'vote_score', 'up_vote_count', 'down_vote_count', 'report_count']
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

  const limit = query.limit
  const offset = query.offset

  if (query.name) { // name query
    // TODO: we should use MySQL or PostgreSQL to use regexp operator
    // SQLite only supports like
    const likeQuery = {
      [Op.like]: '%' + query.name
    }
    query[Op.or] = [{
      'first_name': likeQuery
    }, {
      'last_name': likeQuery
    }]
  }

  let { direction, order } = query
  if (!direction) {
    direction = 'DESC'
  }

  // Remove offset, limit, name
  delete query.limit
  delete query.offset
  delete query.name
  delete query.order
  delete query.direction

  const sQuery = {
    where: query,
    attributes: allowed_attributes,
    raw: true
  }

  if (limit > 0) {
    sQuery.limit = limit
  }

  if (offset >= 0) {
    sQuery.offset = offset
  }

  if (order) {
    sQuery.order = [[order, direction]]
  }

  const users = await User.findAll(sQuery)

  res.send({
    status: true,
    data: users
  })
}

const editMe = async (req, res) => {
  const user = req.currentUser

  const editData = req.body
  // TODO: should limit the editing fields here
  delete editData.password
  delete editData.proof_of_status_date
  delete editData.email_verified_date
  delete editData.sms_verified_date

  // Check settings is valid

  if ('settings' in editData) {
    try {
      JSON.parse(editData.settings)
    } catch (e) {
      return res.status(400).send({
        status: true,
        error: 'invalid_settings'
      })
    }
  }

  for (let key in editData) {
    user[key] = editData[key]
  }

  await user.save()

  const data = user.get({
    plain: true
  })
  delete data.password

  res.send({
    status: true,
    data
  })
}

const sendVerifyEmail = async (req, res) => {
  const { currentUser } = req
  const { email, id } = currentUser
  const subject = 'Please confirm your email address in Watog'
  const code = randomstring.generate(12)
  const link = process.env.WATOG_DOMAIN + '/api/user/verify/email/' + code
  const html = `<html>
    <head></head>
    <body style="font-family:sans-serif;">
      <h1 style="text-align:center">Please confirm your email address</h1>
      <p>
        We here at Watog are happy to have you on 
        board! Just click the following
        link to verify your email address. 
        <a href="${link}">Verify</a>
        ${link}
      </p>
    </body>
    </html>`

  const verify = new Verify({
    user_id: id,
    type: 'email',
    code
  })

  // Save Verification Object
  await verify.save()
  await EmailCtrl.send('support@watog.com', email, subject, html, html)
  res.send({
    status: true
  })
}

const sendVerifySms = async (req, res) => {
  const { currentUser } = req
  const { cell_phone, id } = currentUser
  const code = randomstring.generate(4)

  const verify = new Verify({
    user_id: id,
    type: 'sms',
    code
  })

  // Save Verification Object
  await verify.save()
  try {
    await SmsCtrl.send(cell_phone, `WATOG Verification: ${code}`)
  } catch (e) {
    console.error(e)
    return res.status(500).send({
      status: false,
      error: 'failed_sms'
    })
  }
  res.send({
    status: true
  })
}

const verifyEmail = async (req, res) => {
  const { code } = req.params
  const verify = await Verify.findOne({
    where: {
      code: code,
      type: 'email'
    }
  })

  if (!verify) {
    return res.status(400).send(`<h2>Invalid Link!</h2>`)
  }

  const created = verify.createdAt.getTime()
  const now = new Date().getTime()

  if (now - created > 1000 * 60 * 60) { // 1 hr expire
    return res.status(400).send(`<h2>Expired Link!</h2>`)
  }

  const currentUser = await User.findById(verify.user_id)

  if (!currentUser) {
    return res.status(400).send(`<h2>Expired Link!</h2>`)
  }

  if (currentUser.email_verified_date) { // already verified
    return res.status(400).send('Your email address is already verified!')
  }

  currentUser.email_verified_date = new Date()
  await currentUser.save()
  const { first_name, last_name, email } = currentUser

  res.send(`
    <h2>Welcome ${first_name} ${last_name}!</h2>
    <p>Your email: <b> ${email} </b> is now verified!</p>
    `)
}

const verifySms = async (req, res) => {
  const { currentUser } = req
  const { code } = req.params
  const verify = await Verify.findOne({
    where: {
      user_id: currentUser.id,
      code: code,
      type: 'sms'
    }
  })

  if (!verify) {
    return res.status(400).send(`<h2>Invalid Link!</h2>`)
  }

  const created = verify.createdAt.getTime()
  const now = new Date().getTime()

  if (now - created > 1000 * 60 * 10) { // 10 minutes expire
    return res.status(400).send({
      status: false,
      error: 'expired_code'
    })
  }

  if (currentUser.id !== verify.user_id) { // user_id is not matched
    return res.status(400).send({
      status: false,
      error: 'invalid_code'
    })
  }

  if (currentUser.sms_verified_date) { // already verified
    return res.status(400).send({
      status: false,
      error: 'already_verified'
    })
  }

  currentUser.sms_verified_date = new Date()
  await currentUser.save()

  const data = currentUser.get({
    plain: true
  })
  delete data.password

  res.send({
    status: true,
    data
  })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).send({
      status: false,
      error: 'no_email_or_user_name'
    })
  }
  const _user = await User.findOne({ where: {
    [Op.or]: [{
      email
    }, {
      user_name: email
    }]
  } })

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user'
    })
  }

  const oldPassword = _user.password.split(' ')[0]

  const token = jwt.sign({email: _user.email, hash: oldPassword }, process.env.JWT_SECRET + 'FORGOT_PASSWORD')
  const link = process.env.WATOG_DOMAIN + '/api/user/reset-password/' + token
  const code = randomstring.generate({
    length: 4,
    charset: '1234567890ABCDEFHJKMNPQSTUVWXYZ'
  })

  _user.password = oldPassword + ' ' + code
  await _user.save()
  const html = `<html>
    <head></head>
    <body style="font-family:sans-serif;">
      <h1 style="text-align:center">We received a request to reset your password</h1>
      <p>
        Use this link below to set up a new password.
        <p>
        <a href="${link}"><b>Reset Your Password</b></a>
        </p>
        Or simply you can copy this link to your browser:
        <b>${link}</b>

        Use this code in your app: <b>${code}/b>
      </p>
    </body>
    </html>`

  await EmailCtrl.send('support@watog.com', _user.email, 'Reset your Watog password', html, htm)
  res.send({
    status: true
  })
}

const resetPasswordByToken = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET + 'FORGOT_PASSWORD')
    console.info('Decoded:', decoded)
  } catch (err) {
    console.error(err)
    return res.status(401).send({
      status: false,
      error: 'invalid_link'
    })
  }
  const _user = await User.findOne({ where: { email: decoded.email } })

  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'no_user'
    })
  }

  const delay = new Date().getTime() / 1000 - decoded.iat
  const oldPassword = _user.password.split(' ')[0]

  if (decoded.hash !== oldPassword || delay > 60 * 15) { // 15 minutes expiry check or used link
    return res.status(401).send({
      status: false,
      error: 'expired_link'
    })
  }

  const hash = await bcrypt.hash(password, 8)
  _user.password = hash

  await _user.save()
  res.send({
    status: true
  })
}

const resetPasswordByCode = async (req, res) => {
  const { code, password, email } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(401).send({
      status: false,
      error: 'no_user'
    })
  }

  const aryPassword = user.password.split(' ')
  if (!aryPassword[1] || aryPassword[1] != code) { // Code mismatch
    return res.status(401).send({
      status: false,
      error: 'invalid_code'
    })
  }

  // Expire check
  const delay = new Date().getTime() - user.updatedAt.getTime()

  if (delay > 1000 * 60 * 15) { // More than 15 minutes passed
    return res.status(401).send({
      status: true,
      error: 'expired_code'
    })
  }

  const hash = await bcrypt.hash(password, 8)
  user.password = hash

  await user.save()
  res.send({
    status: true
  })
}

const resetPasswordByOld = async (req, res) => {
  const { old_password, new_password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: errors.array()
    })
  }

  const { email, password } = req.body

  const _user = req.currentUser

  // Check password
  if (!bcrypt.compareSync(old_password, _user.password.split(' ')[0])) {
    return res.status(401).json({
      status: false,
      error: 'invalid_old_password'
    })
  }

  _user.password = await bcrypt.hash(new_password, 8)
  await _user.save()

  res.send({
    status: true
  })
}

module.exports = {
  signup,
  login,
  checkAuth,
  checkAuthOptional,
  getMe,
  editMe,
  getUser,
  queryUsers,
  sendVerifyEmail,
  sendVerifySms,
  verifyEmail,
  verifySms,
  forgotPassword,
  resetPasswordByToken,
  resetPasswordByCode,
  resetPasswordByOld
}
