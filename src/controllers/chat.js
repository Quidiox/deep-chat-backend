const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const chatRouter = require('express').Router()
const Channel = require('../models/Channel')
const Message = require('../models/Message')
const config = require('../utils/config')
const socketConfig = require('../socketio/socketConfig')

chatRouter.get('/', async (req, res) => {
  socketConfig(io, server)
  try {
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

module.exports = chatRouter
