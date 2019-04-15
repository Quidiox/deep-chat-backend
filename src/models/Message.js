const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now },
    hidden: { type: Boolean, default: false }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          text: ret.text,
          author: ret.author,
          created: ret.created,
          edited: ret.edited,
          hidden: ret.hidden
        }
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          text: ret.text,
          author: ret.author,
          created: ret.created,
          edited: ret.edited,
          hidden: ret.hidden
        }
      }
    }
  }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
