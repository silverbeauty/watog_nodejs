const User = require('../models/users')

const signup = async (req, res) => {
	const user = User.build(req.body)
	try {
		await user.save()
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
