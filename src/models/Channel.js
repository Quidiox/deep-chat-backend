const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      index: true,
      dropDups: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    created: { type: Date, default: Date.now() },
    edited: { type: Date, default: Date.now() },
    hidden: { type: Boolean, default: false }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          name: ret.name,
          author: ret.author,
          messages: ret.messages,
          members: ret.members,
          created: ret.created,
          edited: ret.edited,
          hidden: ret.hiddenh
        }
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          name: ret.name,
          author: ret.author,
          messages: ret.messages,
          members: ret.members,
          created: ret.created,
          edited: ret.edited,
          hidden: ret.hidden
        }
      }
    }
  }
)

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
