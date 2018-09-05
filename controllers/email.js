const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_DOMAIN,
  port: process.env.SMTP_PORT || 587,
  secure: !!process.env.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASS // generated ethereal password
  }
})

module.exports.send = (from, to, subject, html, text) => {
  console.info('Send email', from, to, subject, html, text)
  return new Promise((resolve, reject) => { // TODO: Should be replaced with MailGun or something else
    if (process.env.NODE_ENV === 'test') {
      return resolve()
    }

    const mailOptions = {
      from,
      to,
      subject,
      text,
      html
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
        return
      }
      console.log('Message sent: %s', info.messageId)
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      resolve()
    })
  })
}
