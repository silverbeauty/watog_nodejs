const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const base64Img = require('base64-img')

const User = require('../models/user')

const create = (req, res) => {
  if (req.file) {
    res.send({
      status: true,
      data: {
        file_name: req.file.filename,
        url: process.env.WATOG_DOMAIN + '/api/file/' + req.file.filename
      }
    })
  } else if (req.body.file) { // base 64 image
    const fileName = uuidv1()
    try {
      const filePath = base64Img.imgSync(req.body.file, path.resolve('files/'), fileName)
      res.send({
        status: true,
        data: {
          url: process.env.WATOG_DOMAIN + '/api/file/' + path.basename(filePath),
          filename: path.basename(filePath)
        }
      })
    } catch (e) {
      console.error(e)
      res.status(500).send({
        status: false
      })
    }
  }
}

const get = (req, res) => {
  const filePath = path.resolve(`./files/${req.params.id}`)
  console.info('File Path:', filePath)
  if (fs.existsSync(filePath)) {
    const contentType = mime.contentType(path.extname(req.params.id))
    res.set('Content-Type', contentType)
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
    const contentType = mime.contentType(path.extname(req.params.id))
    res.set('Content-Type', contentType)
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
