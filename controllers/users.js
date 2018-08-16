const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator/check');

const User = require('../models/user')

const signup = async (req, res) => {
 	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
    	status: false,
    	error: errors.array()
    })
  }

  const hash = await bcrypt.hash(req.body.password, 8)

	const user = User.build({
		...req.body,
		password: hash
	})
	let data
	try {
		const res = await user.save()
		data = res.get({plain: true})
		// Remove password
		delete data.password
	} catch(e) {
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
	signup,
}
