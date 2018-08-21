module.exports.send = (phoneNumber, text) => {
	console.info('Send SMS:', phoneNumber, text)
	return new Promise((resolve, reject) => { // TODO: Should be replaced with MailGun or something else
		setTimeout(resolve, 1000)
	})
}
