module.exports.send = (phoneNumber, text) => {
	console.info('Send SMS:', phoneNumber, text)
	return Promise((resolve, reject) => { // TODO: Should be replaced with MailGun or something else
		setTimeout(resolve, 1000)
	})
}
