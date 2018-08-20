
const { validationResult } = require('express-validator/check');


const Post = require('../models/post')
const Category = require('../models/category')

const create = async (req, res) => {

	// console.log(req.body)
 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

  // Check valid category

  const { category_id } = req.body
  const category = await Category.findById(category_id)
  if (!category) {
  	return res.status(400).send({
  		status: false,
  		error: 'no category exists:' + category_id
  	})
  }

	const post = Post.build({
		...req.body,
		user_id: req.currentUser.id
	})
	let data
	try {
		const res = await post.save()
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
	create
}
