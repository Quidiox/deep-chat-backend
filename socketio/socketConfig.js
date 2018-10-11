const socketConfig = io => {
  io.on('connection', socket => {
    console.log('a user connected')
    socket.on('message', msg => console.log(msg))
    socket.emit('hi', 'hi world!')
  })
}

module.exports = socketConfig
