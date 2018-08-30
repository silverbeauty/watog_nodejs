const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_FROM

const twilio = require('twilio')(accountSid, authToken)

module.exports.send = (phoneNumber, text) => {
  console.info('Send SMS:', phoneNumber, text)

	return twilio.messages
    .create({from: fromNumber, body: text, to: phoneNumber})
    .then(message => {
    	console.info('SMS Sent:', message)
    	return message
    })
}
