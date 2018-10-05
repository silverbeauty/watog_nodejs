const express = require('express')

const UserCtrl = require('../controllers/user')
const learnData = require('../config/learn.json')

const router = express.Router()

// Get a video list
router.get('/', UserCtrl.checkAuth, (req, res) =>{
  res.send({
    status: true,
    data: learnData
  })
})

module.exports = router
