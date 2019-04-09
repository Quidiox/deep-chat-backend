const Channel = require('../models/Channel')
const Message = require('../models/Message')

const messageController = {}

messageController.getAll = async () => {
  try {
    const messages = await Message.find({})
    return messages
  } catch (error) {
    console.log(error)
    return { error: 'get all messages failed' }
  }
}

messageController.get = async messageId => {
  try {
    const message = await Message.findById(messageId)
    return message
  } catch (error) {
    console.log(error)
    return { error: 'get all messages failed' }
  }
}

messageController.post = async (channelId, text, author) => {
  try {
    const channel = await Channel.findById(channelId)
    const tempMessage = new Message({ text, author })
    const message = await tempMessage.save().select('id text author created')
    await channel.messages.addToSet(message.id)
    await channel.save()
    return { message }
  } catch (error) {
    console.log(error)
    return { error: 'creating new message failed' }
  }
}

module.exports = messageController
