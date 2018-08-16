
const { validationResult } = require('express-validator/check');

const Category = require('../models/category')

const addNew = async (req, res) => {

 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }


	const category = Category.build({
		...req.body
	})
	let data
	try {
		const res = await category.save()
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
	addNew
}
