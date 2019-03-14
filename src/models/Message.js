const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created: { type: Date, default: Date.now() },
  edited: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false }
})

if (!messageSchema.options.toObject) messageSchema.options.toObject = {}

messageSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    text: ret.text,
    author: ret.author,
    created: ret.created,
    edited: ret.edited,
    deleted: ret.deleted,
    hidden: ret.hidden
  }
}

messageSchema.post('init', function(doc) {
  doc.toObject()
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
