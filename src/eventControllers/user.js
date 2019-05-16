const User = require('../models/User')

const userEvents = {}

userEvents.updateChannelActivity = async (channelId, userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        lastActiveChannel: channelId,
        lastVisitOnChannel: lastVisitOnChannel.set(channelId, Date.now())
      },
      { new: true }
    ).select('name username id lastActiveChannel lastVisitOnChannel')
    return { user }
  } catch (error) {
    console.log(error)
    return { error: 'failed to update channel activity' }
  }
}

module.exports = userEvents
