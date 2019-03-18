const channelRouter = require('express').Router()
const Channel = require('../models/Channel')
const Message = require('../models/Message')
const socketConfig = require('../socketio/socketConfig')

//get all channels
channelRouter.get('/', async (req, res) => {
  try {
    const channels = await Channel.find({})
    res.json(channels)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})
//get channel and all messages
channelRouter.get('/channelId/', async (req, res) => {
  try {
    const messages = await Channel.findById(req.params.id)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

module.exports = channelRouter
