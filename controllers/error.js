const catchError = (callback) => {
	return async (req, res) => {
		try {
			await callback(req, res)
		} catch (e) {
			res.status(500).send({
				status: false,
				error: 'internal_server_error'
			})
		}
	}
}

module.exports = {
	catchError
}
