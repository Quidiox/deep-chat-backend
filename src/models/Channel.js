const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
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
  deleted: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false }
})

if (!channelSchema.options.toObject) channelSchema.options.toObject = {}

channelSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    name: ret.name,
    author: ret.author,
    messages: ret.messages,
    members: ret.members,
    created: ret.created,
    edited: ret.edited,
    deleted: ret.deleted,
    hidden: ret.hidden
  }
}

channelSchema.post('init', function(doc) {
  doc.toObject()
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
