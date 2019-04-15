const channelController = require('../../src/controllers/channel')
const messageController = require('../../src/controllers/message')
const socketConfig = socket => {
  console.log(`User with id ${socket.userId} connected`)
  socket.on('clientConnected', message => {
    console.log(message)
    socket.emit('serverConnected', `Connection to server successful.`)
  })

  socket.on('LOAD_ALL_CHANNELS_REQUEST', async () => {
    const channels = await channelController.getByUser(socket.userId)
    channels.map(channel => {
      socket.join(channel.id)
    })
    socket.emit('LOAD_ALL_CHANNELS_RESPONSE', {
      type: 'LOAD_ALL_CHANNELS_RESPONSE',
      payload: channels
    })
  })

  socket.on('USER_JOIN_CHANNEL_REQUEST', async name => {
    const channel = await channelController.joinOrCreate(name, socket.userId)
    socket.join(channel.id).emit('USER_JOIN_CHANNEL_RESPONSE', {
      type: 'USER_JOIN_CHANNEL_RESPONSE',
      payload: channel
    })
  })

  socket.on('USER_LEAVE_CHANNEL_REQUEST', async name => {
    const result = await channelController.leaveOrDestroy(name, socket.userId)
    if (result.notice) {
      socket.emit('USER_LEAVE_CHANNEL_RESPONSE', {
        type: 'USER_LEAVE_CHANNEL_RESPONSE',
        payload: result
      })
    } else {
      socket.emit('USER_LEAVE_CHANNEL_RESPONSE', {
        type: 'USER_LEAVE_CHANNEL_RESPONSE',
        payload: result
      })
      socket.leave(result.name)
    }
  })

  socket.on('NEW_MESSAGE_REQUEST', async ({ channelId, text }) => {
    const message = await messageController.newMessage(
      channelId,
      text,
      socket.userId
    )
    socket.emit('NEW_MESSAGE_RESPONSE', {
      type: 'NEW_MESSAGE_RESPONSE',
      payload: {
        message,
        channelId
      }
    })
  })
}

module.exports = socketConfig
