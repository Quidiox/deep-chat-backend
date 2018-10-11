const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
    dropDups: true
  },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true }
})

if (!userSchema.options.toObject) userSchema.options.toObject = {}

userSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    username: ret.username,
    name: ret.name,
    passwordHash: ret.passwordHash
  }
}

userSchema.post('init', function(doc) {
  doc.toObject()
})

const User = mongoose.model('User', userSchema)

module.exports = User
