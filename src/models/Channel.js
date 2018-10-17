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
  created: { type: Date, default: Date.now() },
  messages: [
    {
      title: { type: String, required: true, index: true },
      text: { type: String, required: false },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created: { type: Date, default: Date.now() },
      edited: { type: Date, default: Date.now() },
      deleted: { type: Boolean },
      hidden: { type: Boolean }
    }
  ],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deleted: { type: Boolean },
  hidden: { type: Boolean }
})

if (!channelSchema.options.toObject) userSchema.options.toObject = {}

channelSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    name: ret.name,
    creator: ret.creator,
    messages: ret.messages
  }
}

channelSchema.post('init', function(doc) {
  doc.toObject()
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = User
