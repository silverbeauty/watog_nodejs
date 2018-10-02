const socketioJwt = require("socketio-jwt")
const User = require('../models/user')
const Member = require('../models/member')
const Room = require('../models/room')

let io

const authenticated = async (socket) => {
  //this socket is authenticated, we are good to handle more events from it.
  const { email } = socket.decoded_token
  console.log('Socket User Authorized: ' + email)
  // TODO: read all rooms
  // TODO: join rooms
  // socket.join('some room');

  // TODO:Send message
  // io.to('some room').emit('some event');
  const user = await User.findOne({ where: { email } })
  !user && socket.disconnect()

  // Find all his rooms
  const memberRooms = await Room.findAll({
    where: {},
    include: [{
      model: Member,
      include: [{ model: User, attributes: userFields }],
      where: { user_id: currentUser.id, removed: false }
    }, {
        model: User,
        attributes: userFields
      }]
    })

  memberRooms.forEach(r => {
    socket.join(r.id) // subscribe to rooms
  })

  socket.on('new_message', createNewMessage.bind(this, socket, user))
}

const createNewMessage = async (socket, user, data, callback) => {
  
}

const setup = (io) => {
	io = io

  io.sockets
    .on('connection', socketioJwt.authorize({
      secret: process.env.JWT_TOKEN,
      timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', authenticated)
}

module.exports = {
	setup
}
