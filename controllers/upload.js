
const { validationResult } = require('express-validator/check');


const Uploads = require('../models/uploads')

const Upload = async (req, res) => {

	// console.log(req.body)
 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }


	const uploads = Uploads.build({
		...req.body
	})
	let data
	try {
		const res = await uploads.save()
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
	Upload
}