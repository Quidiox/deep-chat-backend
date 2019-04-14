const channelController = require('../../src/controllers/channel')
const messageController = require('../../src/controllers/message')
const socketConfig = socket => {
  console.log(`User with id ${socket.userId} connected`)
  socket.on('clientConnected', message => {
    console.log(message)
    socket.emit('serverConnected', `Connection to server successful.`)
  })
  // Chatroom specific events
  socket.on('USER_JOIN_CHANNEL_REQUEST', async name => {
    const channel = await channelController.post(name, socket.userId)
    socket.emit('USER_JOIN_CHANNEL_RESPONSE', {
      type: 'USER_JOIN_CHANNEL_RESPONSE',
      payload: channel
    })
    // socket.join(channel.name, () => {
    //   let rooms = Object.keys(socket.rooms)
    //   console.log(rooms)
    //   io.to(channel.name).emit(
    //     'USER_JOIN_CHANNEL_RESPONSE',
    //     `${user.name} has joined channel ${channel.name}`
    //   )
    // })
  })

  socket.on('USER_LEAVE_CHANNEL_REQUEST', () => {})

  socket.on('NEW_MESSAGE_REQUEST', text => {
    const message = messageController.post({
      userId,
      text
    })
    socket.emit('NEW_MESSAGE_RESPONSE', {
      username: message.username,
      message: message.text
    })
  })

  socket.on('LOAD_ALL_CHANNELS_REQUEST', async () => {
    const channels = await channelController.getByUser(socket.userId)
    channels.map(channel => {
      socket.join(channel.name)
    })
    socket.emit('LOAD_ALL_CHANNELS_RESPONSE', {
      type: 'LOAD_ALL_CHANNELS_RESPONSE',
      payload: channels
    })
  })

  socket.on('create', () => {})

  socket.on('delete', () => {})

  socket.on('chatroomUsers', () => {})

  socket.on('availableUsers', () => {})

  socket.on('error', () => {})
}

module.exports = socketConfig
