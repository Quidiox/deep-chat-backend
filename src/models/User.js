const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      required: true,
      dropDups: true
    },
    nickname: { type: String, required: true, unique: true, dropDups: true },
    passwordHash: { type: String, required: true },
    lastActiveChannel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    lastVisitOnChannel: {
      type: Map,
      of: Date
    }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          username: ret.username,
          nickname: ret.nickname,
          passwordHash: ret.passwordHash,
          lastActiveChannel: ret.lastActiveChannel,
          lastVisitOnChannel: ret.lastVisitOnChannel
        }
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          username: ret.username,
          nickname: ret.nickname,
          passwordHash: ret.passwordHash,
          lastActiveChannel: ret.lastActiveChannel,
          lastVisitOnChannel: ret.lastVisitOnChannel
        }
      }
    }
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
