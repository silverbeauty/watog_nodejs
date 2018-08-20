const path = require('path')
const mime = require('mime-types')
const fs = require('fs')

const create = (req, res) => {
	res.send({
		status: true
	})
}

const get = (req, res) => {
	const filePath = path.resolve(`files/${path.resolve(req.params.id)}`)

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

module.exports = {
	create,
	get
}
