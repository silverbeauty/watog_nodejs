const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Member = require('../models/member')
const Room = require('../models/room')
const Message = require('../models/message')

const userFields = ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'user_name', 'country']
let sio

const authenticated = async (socket) => {
  console.info('Check User fo Socket:', socket.id, socket.decoded)
  //this socket is authenticated, we are good to handle more events from it.
  const { email } = socket.decoded
  // TODO: read all rooms
  // TODO: join rooms
  // socket.join('some room');

  // TODO:Send message
  // io.to('some room').emit('some event');
  const currentUser = await User.findOne({ where: { email } })
  !currentUser && socket.disconnect()

  console.info('Socket User Authorized: ', currentUser.get({plain: true}).id)
  socket.emit('authenticated', {
    status: true
  })
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

  // Join self channel - will be used to notify room events
  socket.join(currentUser.id)

  memberRooms.forEach(r => {
    console.info('Joined to:', r.id)
    socket.join(r.id) // subscribe to rooms
  })

  socket.on('send_message', createNewMessage.bind(this, socket, currentUser))
}

const createNewMessage = async (socket, currentUser, data) => {
  const { room_id } = data
  // Load room
  const room = await Room.findOne({
    where: { id: room_id },
    include: [{
      model: Member,
      include: [{ model: User, attributes: userFields }],
      where: { user_id: currentUser.id, removed: false }
    }, {
        model: User,
        attributes: userFields
      }]
  })

  if (!room) {
    return {
      status: false,
      error: 'invalid_room'
    }
  }

  const member = await Member.findOne({
    user_id: currentUser.id,
    room_id: room.id
  })

  const message = await (new Message({
    member_id: member.id,
    room_id,
    text: data.text,
  })).save()

  const result = await Message.findOne({
    where: { id: message.id },
    include: [{ model: Member, include: [{ model: User, attributes: userFields }] }]
  })

  console.info('New Message Created:', message.get({plain: true}))

  sio.to(room.id).emit('new_message', result.get({
    plain: true
  }))

  return {
    status: true,
    data: result
  }
}

const notifyNewRoom = (room) => {
  if (!sio) { return console.info('Socket not ready for room:', room ) }
  const { Members } = room
  Members.forEach((m) => {
    sio.to(m.user_id).emit('new_room', room.get({ plain: true }))
  })
}

const notifyRoomUpdate = (room) => {
  if (!sio) { return console.info('Socket not ready for room:', room ) }
  sio.to(room.id).emit('room_updated', room.get({ plain: true }))
}

const notifyRoomMemberLeft = (member) => {
  if (!sio) { return console.info('Socket not ready for member leave:', member ) }
  // Leave room
  sio.to(member.user_id).leave(member.room_id)
  sio.to(member.room_id).emit('member_left_room', member.get({ plain: true }))
}

const checkJWT = (socket, token) => {
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    console.error('Socket Auth Failed:', e)
    socket.disconnect(true)
    return
  }
  console.info('Socket JWT Authenticated:', socket.id, decoded)
  socket.decoded = decoded
  authenticated(socket)
}

const setup = (io) => {
	sio = io
  console.info('Setup Socket.io:')
  io.sockets
    .on('connection', (socket) => {
      const { token } = socket.handshake.query
      if (token) {
        checkJWT(socket, token)
      } else {
        setTimeout(() => {
          if (!socket || !socket.decoded) { // not authenticated for 15 seconds
            try { socket.disconnect(true) } catch(e) { console.error(e) }
          }
        }, 15000) // 15 seconds        
      }

      socket.on('authenticate', async (data) => {
        checkJWT(socket, data.token)
      })
      .on('disconnecting', () => {
        console.info('Socket Disconnecting:', socket.id)
      })
      //auth(socket)
    })
}

module.exports = {
	setup,
  notifyNewRoom,
  notifyRoomUpdate,
  notifyRoomMemberLeft
}
