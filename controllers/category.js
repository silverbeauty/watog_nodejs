
const { validationResult } = require('express-validator/check');

const Category = require('../models/category')

const create = async (req, res) => {

 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

  const category = Category.build({
		type: req.body.type,
		user_id: req.currentUser.id
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

const get = async (req, res) => {
	const category = await Category.findById(req.params.id)
	res.send({
		status: true,
		data: category.get({ plain: true} )
	})
}

module.exports = {
	create
}
