const phone = require('phone')

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_FROM

const twilio = require('twilio')(accountSid, authToken)

module.exports.send = (phoneNumber, text) => {
  const e164Phone = phone(phoneNumber)[0]
  console.info(`Send SMS: ${fromNumber} -> ${phoneNumber} :`, text)

  if (process.env.NODE_ENV === 'test') {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  const error = {
    error: 'Invalid Phone Number'
  }

  throw error // Invalid phone number

  return twilio.messages
    .create({from: fromNumber, body: text, to: e164Phone})
    .then(message => {
      console.info('SMS Sent:', message)
      return message
    })
}
