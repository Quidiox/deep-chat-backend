const Channel = require('../models/Channel')

const channelController = {}

//get all channels you have joined
channelController.getByUser = async userId => {
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

channelController.getChannelMessages = async channelId => {
  try {
    const channelMessages = await Channel.findById(channelId).populate({
      path: 'messages',
      populate: { path: 'author', select: 'name' }
    })
    return channelMessages
  } catch (error) {
    console.log(error)
    return { error: `error getting channel ${channelId} messages` }
  }
}

channelController.getChannelMembers = async channelId => {
  try {
    const channelUsers = await Channel.findById(channelId).populate('members')
    return channelUsers
  } catch (error) {
    console.log(error)
    return { error: `error getting channel ${channelId} members` }
  }
}

channelController.getMessagesRange = async (channelId, from, to) => {
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

channelController.joinOrCreate = async (name, author) => {
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

channelController.leaveOrDestroy = async (name, author) => {
  try {
    const channelExist = await Channel.findOne({ name })
    if (channelExist && channelExists.name === name) {
      if (channelExists.members.length > 1) {
        const filteredMembers = channelExists.members.filter(member => {
          return member.id !== author
        })
        channelExists.members = filteredMembers
        channelExists.save()
        return { name, success: `${author} removed from channel ${name}` }
      } else {
        await Channel.findOneAndDelete({ name })
        return { name, success: `channel ${name} deleted` }
      }
    }
  } catch (error) {
    return { notice: `no channel with name ${name} found` }
  }
}

module.exports = channelController
