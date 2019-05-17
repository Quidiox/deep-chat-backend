const channelEvents = require('../eventControllers/channel')
const messageEvents = require('../eventControllers/message')
const userEvents = require('../eventControllers/user')

const socketConfig = (io, socket) => {
  socket.on('clientConnected', message => {
    console.log(message)
    socket.emit('serverConnected', `Connection to server successful.`)
  })

  socket.on('LOAD_ALL_CHANNELS_REQUEST', async () => {
    const channels = await channelEvents.getByUser(socket.userId)
    channels.map(channel => {
      socket.join(channel.id)
    })
    socket.emit('LOAD_ALL_CHANNELS_RESPONSE', {
      type: 'LOAD_ALL_CHANNELS_RESPONSE',
      payload: channels
    })
  })

  socket.on('USER_JOIN_CHANNEL_REQUEST', async name => {
    const channel = await channelEvents.joinOrCreate(name, socket.userId)
    socket.join(channel.id).emit('USER_JOIN_CHANNEL_RESPONSE', {
      type: 'USER_JOIN_CHANNEL_RESPONSE',
      payload: channel
    })
  })

  socket.on('USER_LEAVE_CHANNEL_REQUEST', async channelId => {
    const result = await channelEvents.leaveOrDestroy(channelId, socket.userId)
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
      socket.leave(channelId)
    }
  })

  socket.on('NEW_MESSAGE_REQUEST', async ({ channelId, text }) => {
    const message = await messageEvents.newMessage(
      channelId,
      text,
      socket.userId,
      socket.nickname
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
    const messages = await channelEvents.getChannelMessages(channelId)
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
      client => io.sockets.connected[client].nickname
    )
    const members = await channelEvents.getChannelMembers(channelId)
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
  socket.on('USER_SET_ACTIVE_CHANNEL_REQUEST', async channelId => {
    const user = await userEvents.updateChannelActivity(
      channelId,
      socket.userId
    )
    console.log(user)
    socket.emit('USER_SET_ACTIVE_CHANNEL_RESPONSE', {
      type: 'USER_SET_ACTIVE_CHANNEL_RESPONSE',
      payload: user
    })
  })
}

module.exports = socketConfig
