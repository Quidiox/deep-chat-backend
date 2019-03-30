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
    name: { type: String, required: true },
    passwordHash: { type: String, required: true }
  },
  {
    toObject: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          username: ret.username,
          name: ret.name,
          passwordHash: ret.passwordHash
        }
      }
    },
    toJSON: {
      transform: function(doc, ret) {
        return {
          id: ret._id,
          username: ret.username,
          name: ret.name,
          passwordHash: ret.passwordHash
        }
      }
    }
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
