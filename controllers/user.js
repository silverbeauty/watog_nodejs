const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')
const randomstring = require('randomstring')
 
const User = require('../models/user')
const Verify = require('../models/verify')
const EmailCtrl = require('./email')
const SmsCtrl = require('./sms')

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
  } catch (err) {
    console.error(err)
    return res.status(401).send({
      status: false,
      error: 'Invalid Authorization'
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
      error: 'Invalid User'
    })
  }
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

const queryUsers = async (req, res) => {
  // TODO: query condition should be defined in route
  // TODO: limit access to users
  // TODO: should add sort option
  const allowed_queries = ['limit', 'offset', 'first_name', 'last_name', 'country', 'hospital']
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

  const users = await User.findAll({
    where: query,
    attributes: ['id', 'first_name', 'last_name', 'country', 'hospital', 'cell_phone'],
    limit,
    offset,
    raw: true
  })

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
  const text = `<html>
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
    code,
  })

  // Save Verification Object
  await verify.save()
  await EmailCtrl.send('support@watog.com', email, subject, text)
  res.send({
    status: true
  })
}

const sendVerifySms = async (req, res) => {
  const { currentUser } = req
  const { cell_phone, id } = currentUser
  const subject = 'Please confirm your email address in Watog'
  const code = randomstring.generate(4)
  const link = process.env.WATOG_DOMAIN + '/api/user/verify/email/' + code
  
  const verify = new Verify({
    user_id: id,
    type: 'sms',
    code,
  })

  // Save Verification Object
  await verify.save()
  await SmsCtrl.send(cell_phone, code)
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

  if (currentUser.email_verified_date) { // already verified
    return res.status(400).send('Your email address is already verified!')
  }

  currentUser.email_verified_date = new Date()
  await currentUser.save()
  const { first_name, last_name, email } = currentUser

  res.send(`
    <h2>Welcome ${first_name} ${last_name}</h2>
    <p>Your email: ${email} is now verified!</p>
    `)
}

const verifySms = async (req, res) => {

}

module.exports = {
  signup,
  login,
  checkAuth,
  getMe,
  editMe,
  getUser,
  queryUsers,
  sendVerifyEmail,
  sendVerifySms,
  verifyEmail,
  verifySms
}
