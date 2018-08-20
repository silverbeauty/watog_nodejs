
const { validationResult } = require('express-validator/check');


const Upload = require('../models/upload')

const createUpload = async (req, res) => {

	// console.log(req.body)
 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

	const upload = Upload.build({
		...req.body
	})
	let data
	try {
		const res = await upload.save()
		data = res.get({plain: true})
		// Remove password
	} catch(e) {
		console.log(e)
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

module.exports = {
	createUpload
}
