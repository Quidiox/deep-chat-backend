const socketConfig = (io, server) => {
  io.on('connection', socket => {
    console.log('a user connected')
    socket.on('message', msg => console.log(msg))
    socket.emit('hi', 'hi world!')
  })
  server.on('close', () => {
    socket.disconnect()
  })
}

module.exports = socketConfig
