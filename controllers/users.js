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

	const user = User.build(req.body)
	try {
		const res = await user.save()
		console.info('Res:', res.get({plain:true}))
	} catch(e) {
		console.error(e)
		return res.status(500).send({
			status: false,
			error: 'SignUp Failed!'
		})
	}

	res.send({
		status: true, 
		data: req.body
	})
}

module.exports = {
	signup,
}
