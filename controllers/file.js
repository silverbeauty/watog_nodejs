const path = require('path')
const mime = require('mime-types')
const fs = require('fs')

const User = require('../models/user')

const create = (req, res) => {
  if (req.file) {
    res.send({
      status: true,
      data: {
        id: req.file.filename
      }
    })
  } else {
    res.status(400).send({
      status: false,
      error: 'file is not passed!'
    })
  }
}

const get = (req, res) => {
  const filePath = path.resolve(`./files/${req.params.id}`)
  console.info('File Path:', filePath)
  if (fs.existsSync(filePath)) {
	  res.set('Content-Type', mime.lookup(filePath))
    res.sendFile(filePath)
  } else {
  	res.status(404).send({
  		status: false,
  		error: 'File does not exist'
  	})
  }
}

// TODO: it needs a supervisor access or own access
const getVerifyDoc = (req, res) => {
  const filePath = path.resolve(`./docs/${req.params.id}`)
  console.info('File Path:', filePath)
  if (fs.existsSync(filePath)) {
    res.set('Content-Type', mime.lookup(filePath))
    res.sendFile(filePath)
  } else {
    res.status(404).send({
      status: false,
      error: 'File does not exist'
    })
  }
}

const uploadVerifyDoc = async (req, res) => {
  if (req.file) {
    const { currentUser } = req
    currentUser.proof_of_status = process.env.WATOG_DOMAIN + '/api/file/verify/' + req.file.filename
    await currentUser.save()
    const data = currentUser.get({
      plain: true
    })

    delete data.password

    res.send({
      status: true,
      data
    })
  } else {
    res.status(400).send({
      status: false,
      error: 'file is not passed!'
    })
  }
}

module.exports = {
  create,
  get,
  uploadVerifyDoc,
  getVerifyDoc
}
