const User = require('../models/User')

const userEvents = {}

userEvents.updateChannelActivity = async (channelId, userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        activeChannel: channelId
        // lastVisitOnChannel: lastVisitOnChannel.set(channelId, Date.now())
      },
      { new: true }
    ).select('id username nickname activeChannel lastVisitOnChannel')
    return {
      username: user.username,
      nickname: user.nickname,
      id: user.id,
      activeChannel: user.activeChannel,
      lastVisitOnChannel: user.lastVisitOnChannel
    }
  } catch (error) {
    console.log(error)
    return { error: 'failed to update channel activity' }
  }
}

userEvents.updateLastVisitOnChannel = async (channelId, userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        lastVisitOnChannel: lastVisitOnChannel.set(channelId, Date.now())
      },
      { new: true }
    ).select('name username id lastActiveChannel lastVisitOnChannel')
    return {
      username: user.username,
      nickname: user.nickname,
      id: user.id,
      activeChannel: user.activeChannel,
      lastVisitOnChannel: user.lastVisitOnChannel
    }
  } catch (error) {
    console.log(error)
    return { error: 'failed to update last visit on channel' }
  }
}

module.exports = userEvents
