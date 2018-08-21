
module.exports.send = (from, to, subject, body) => {
  console.info('Send email', from, to, subject, body)
  return new Promise((resolve, reject) => { // TODO: Should be replaced with MailGun or something else
    setTimeout(resolve, 1000)
  })
}
