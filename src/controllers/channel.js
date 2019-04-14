const Channel = require('../models/Channel')
const User = require('../models/User')
const Message = require('../models/Message')
const mongoose = require('mongoose')

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
//get channel and 100 last messages
channelController.get = async channelId => {
  try {
    const channel = await Channel.findById(channelId).select(
      'id name members author'
    )
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
    const channelExists = await Channel.findOne({ name })
    if (channelExists && channelExists.name === name) {
      if (!channelExists.members.find(el => el.toString() === author)) {
        channelExists.members.addToSet(author)
        const saved = await channelExists.save()
        return saved
      }
      return { error: `user is already a member of channel ${name}` }
    }
    const channel = new Channel({ name, author, members: [author] })
    const savedChannel = await channel.save()
    return savedChannel
  } catch (error) {
    console.log(error)
    return { error: 'failed to create chat channel' }
  }
}

module.exports = channelController
