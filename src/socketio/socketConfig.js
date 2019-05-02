const channelController = require('../../src/controllers/channel')
const messageController = require('../../src/controllers/message')
const socketConfig = (io, socket) => {
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
      socket.userId,
      socket.userName
    )
    io.in(channelId).emit('NEW_MESSAGE_RESPONSE', {
      type: 'NEW_MESSAGE_RESPONSE',
      payload: {
        channelId,
        message
      }
    })
  })
  socket.on('LOAD_CHANNEL_MESSAGES_REQUEST', async ({ channelId }) => {
    const messages = await channelController.getChannelMessages(channelId)
    socket.emit('LOAD_CHANNEL_MESSAGES_RESPONSE', {
      type: 'LOAD_CHANNEL_MESSAGES_RESPONSE',
      payload: {
        channelId,
        messages
      }
    })
  })
  socket.on('LOAD_CHANNEL_MEMBERS_REQUEST', async ({ channelId }) => {
    const clientsConnected = io.sockets.adapter.rooms[channelId].sockets
    const activeMembers = Object.keys(clientsConnected).map(
      client => io.sockets.connected[client].userName
    )
    const members = await channelController.getChannelMembers(channelId)
    const membersToReturn = Object.assign({}, members.toJSON(), {
      activeMembers
    })
    socket.emit('LOAD_CHANNEL_MEMBERS_RESPONSE', {
      type: 'LOAD_CHANNEL_MEMBERS_RESPONSE',
      payload: {
        channelId,
        members: membersToReturn
      }
    })
  })
}

module.exports = socketConfig
