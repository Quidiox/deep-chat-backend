const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hidden: { type: Boolean, default: false }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          text: ret.text,
          author: ret.author,
          hidden: ret.hidden,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt
        }
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          text: ret.text,
          author: ret.author,
          hidden: ret.hidden,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt
        }
      }
    },
    timestamps: true
  }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
