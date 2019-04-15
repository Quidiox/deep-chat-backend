const Channel = require('../models/Channel')
const Message = require('../models/Message')

const messageController = {}

messageController.get = async messageId => {
  try {
    const message = await Message.findById(messageId)
    return message
  } catch (error) {
    console.log(error)
    return { error: 'get all messages failed' }
  }
}

messageController.newMessage = async (channelId, text, author) => {
  try {
    const channel = await Channel.findById(channelId)
    const tempMessage = new Message({ text, author })
    const message = await tempMessage.save()
    await channel.messages.addToSet(message.id)
    await channel.save()
    return message
  } catch (error) {
    console.log(error)
    return { error: 'creating new message failed' }
  }
}

messageController.deleteMessage = async (channelId, messageId, author) => {
  try {
    const channel = await Channel.findById(channelId)
    await Message.findByIdAndDelete(messageId)
    const filteredChannel = channel.messages.filter(message => {
      return message.id !== messageId
    })
    await filteredChannel.save()
    return {
      success: `message ${messageId} deleted successfully`,
      channelId,
      messageId
    }
  } catch (error) {
    console.log(error)
    return { error: `failed to delete message ${messageId}` }
  }
}

module.exports = messageController
