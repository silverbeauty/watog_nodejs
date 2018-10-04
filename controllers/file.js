const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const base64Img = require('base64-img')

const File = require('../models/file')
const User = require('../models/user')
const { FILES_PATH, DOCS_PATH } = require('../config/path')

const create = async (req, res) => {
  if (req.file) {
    if (req.currentUser) {
      const file = new File({
        user_id: req.currentUser.id,
        name: req.file.filename,
        type: 'image'
      })
      await file.save()
    }
    res.send({
      status: true,
      data: {
        file_name: req.file.filename,
        url: process.env.WATOG_DOMAIN + '/api/file/' + req.file.filename
      }
    })
  } else if (req.body.file) { // base 64 image
    const fileName = uuidv1()
    const filePath = base64Img.imgSync(req.body.file, FILES_PATH, fileName)
    if (req.currentUser) {
      const file = new File({
        user_id: req.currentUser.id,
        name: path.basename(filePath),
        type: 'image'
      })

      await file.save()
    }

    res.send({
      status: true,
      data: {
        url: process.env.WATOG_DOMAIN + '/api/file/' + path.basename(filePath),
        filename: path.basename(filePath)
      }
    })
  }
}

const get = (req, res) => {
  const filePath = FILES_PATH + req.params.id
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
  const filePath = DOCS_PATH + req.params.id
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
  const { currentUser } = req
  if (req.file) {
    const file = new File({
      user_id: currentUser.id,
      name: req.file.filename,
      type: 'verify_doc'
    })

    await file.save()
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
    const fileName = uuidv1()
    try {
      const filePath = base64Img.imgSync(req.body.file, DOCS_PATH, fileName)
      const file = new File({
        user_id: currentUser.id,
        name: path.basename(filePath),
        type: 'verify_doc'
      })

      await file.save()
      currentUser.proof_of_status = process.env.WATOG_DOMAIN + '/api/file/verify/' + path.basename(filePath)
      await currentUser.save()

      const data = currentUser.get({
        plain: true
      })

      delete data.password

      res.send({
        status: true,
        data
      })
    } catch (e) {
      console.error(e)
      res.status(500).send({
        status: false
      })
    }
  }
}

const remove = async (req, res) => {
  try {
    const file = File.findOne({
      where: {
        user_id: req.currentUser.id,
        name: req.params.id
      }
    })

    if (file) {
      fs.unlinkSync(FILES_PATH + req.params.id)
      res.send({
        status: true,
        data: {
          file_name: req.params.id
        }
      })
    } else {
      res.status(404).send({
        status: false,
        error: 'file_not_found'
      })
    }
  } catch (e) {
    console.error(e)
    res.status(500).send({
      status: false,
      error: 'internal_server_error'
    })
  }
}

module.exports = {
  create,
  get,
  remove,
  uploadVerifyDoc,
  getVerifyDoc
}
