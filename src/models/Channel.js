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
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
          hidden: ret.hidden
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
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
          hidden: ret.hidden
        }
      }
    },
    timestamps: true
  }
)

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
