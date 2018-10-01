const socketioJwt = require("socketio-jwt")

const authenticated = (socket) => {
  //this socket is authenticated, we are good to handle more events from it.
  console.log('hello! ' + socket.decoded_token.name);

  // TODO: read all rooms
  // TODO: join rooms
  // socket.join('some room');

  // TODO:Send message
  // io.to('some room').emit('some event');
}


const setup = (io) => {
	io.sockets
  .on('connection', socketioJwt.authorize({
    secret: process.env.JWT_TOKEN,
    timeout: 15000 // 15 seconds to send the authentication message
  })).on('authenticated', authenticated);
}

module.exports = {
	setup
}
