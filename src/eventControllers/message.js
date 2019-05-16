const Channel = require('../models/Channel')
const Message = require('../models/Message')

const messageEvents = {}

messageEvents.newMessage = async (channelId, text, authorId, authorName) => {
  try {
    const channel = await Channel.findById(channelId)
    const tempMessage = new Message({ text, author: authorId })
    const savedMessage = await tempMessage.save()
    const message = Object.assign({}, savedMessage.toJSON(), {
      author: { id: authorId, nickname: authorName }
    })
    await channel.messages.addToSet(message.id)
    await channel.save()
    return message
  } catch (error) {
    console.log(error)
    return { error: 'creating message failed' }
  }
}

module.exports = messageEvents
