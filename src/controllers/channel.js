const Channel = require('../models/Channel')
const Message = require('../models/Message')

const channelController = {}

//get all channels you have joined
channelController.getAll = async user => {
  try {
    const channels = await Channel.find({ members: user.id }).select(
      'name members'
    )
    return channels
  } catch (error) {
    console.log(error)
    return { error: 'error when getting channels' }
  }
}
//get channel and 100 last messages
channelController.get = async channelId => {
  try {
    const channel = await Channel.findById(channelId)
    return channel
  } catch (error) {
    console.log(error)
    return { error: `error getting channel by id ${channelId}` }
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

channelController.post = async (name, author) => {
  try {
    const channel = new Channel({ name, author })
    const savedChannel = await channel.save()
    return savedChannel
  } catch (error) {
    console.log(error)
    return { error: 'failed to create chat channel' }
  }
}

module.exports = channelController
