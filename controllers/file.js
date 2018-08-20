const path = require('path')
const mime = require('mime-types')
const fs = require('fs')

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

module.exports = {
	create,
	get
}
