const Channel = require('../models/Channel')
const Message = require('../models/Message')

const channelEvents = {}

//get all channels you have joined
channelEvents.getByUser = async userId => {
  try {
    const channels = await Channel.find({ members: userId }).select(
      'id name members author'
    )
    return channels
  } catch (error) {
    console.log(error)
    return { error: 'error when getting channels' }
  }
}

channelEvents.getChannelMessages = async channelId => {
  try {
    const channelMessages = await Channel.findById(channelId).populate({
      path: 'messages',
      populate: { path: 'author', select: 'nickname' }
    })
    return channelMessages
  } catch (error) {
    console.log(error)
    return { error: `error getting channel ${channelId} messages` }
  }
}

channelEvents.getChannelMembers = async channelId => {
  try {
    const channelUsers = await Channel.findById(channelId).populate({
      path: 'members',
      select: 'id username nickname'
    })
    return channelUsers
  } catch (error) {
    console.log(error)
    return { error: `error getting channel ${channelId} members` }
  }
}

channelEvents.getMessagesRange = async (channelId, from, to) => {
  try {
    const channel = await Channel.findById(channelId)
    return channel
  } catch (error) {
    console.log(error)
    return {
      error: `error getting messages from ${from} to ${to} at channel by id ${channelId}`
    }
  }
}

channelEvents.joinOrCreate = async (name, author) => {
  try {
    const channelExists = await Channel.findOne({ name })
    if (channelExists && channelExists.name === name) {
      if (!channelExists.members.find(el => el.toString() === author)) {
        channelExists.members.addToSet(author)
        const saved = await channelExists.save()
        return saved
      }
      return { notice: `user is already a member of channel ${name}` }
    }
    const channel = new Channel({ name, author, members: [author] })
    const savedChannel = await channel.save()
    return savedChannel
  } catch (error) {
    console.log(error)
    return { error: 'failed to create chat channel' }
  }
}

channelEvents.leaveOrDestroy = async (id, author) => {
  try {
    const channelExists = await Channel.findById(id)
    if (
      channelExists &&
      channelExists.id === id &&
      channelExists.members.length > 1
    ) {
      const filteredMembers = channelExists.members.filter(
        memberId => String(memberId) !== author
      )
      const modifiedChannel = Object.assign({}, channelExists.toJSON(), {
        members: filteredMembers
      })
      await Channel.findOneAndUpdate({ _id: id }, modifiedChannel, {
        new: true
      })
      return { id, success: `${author} removed from channel ${id}` }
    } else {
      for (const messageId of channelExists.messages) {
        await Message.findOneAndRemove({ _id: messageId })
      }
      await Channel.findOneAndRemove({ _id: id })
      return { id, success: `channel ${id} deleted` }
    }
  } catch (error) {
    return { notice: `no channel with id ${id} found` }
  }
}

module.exports = channelEvents
