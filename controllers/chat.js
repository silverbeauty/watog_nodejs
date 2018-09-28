const authenticated = (socket) => {
  //this socket is authenticated, we are good to handle more events from it.
  console.log('hello! ' + socket.decoded_token.name);

  // TODO: read all rooms
  // TODO: join rooms
  // socket.join('some room');

  // TODO:Send message
  // io.to('some room').emit('some event');
}

module.exports = {
	authenticated
}
